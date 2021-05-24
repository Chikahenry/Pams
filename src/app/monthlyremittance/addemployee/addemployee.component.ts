import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {
  addEmployeeForm: FormGroup;
  submitted: boolean;
  apiUrl: string;
  employeesData: any;
  showAddNewEmployee: boolean = false;
  modalOptions: NgbModalOptions;
  closeResult: string;
  dtOptions: any = {};
  showListOfEmployees: boolean = true;
  corporateName: string;
  roleID: any;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private sess: SessionService,
              private modalService: NgbModal,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.checkLogin();
    this.roleID = localStorage.getItem('role_id');

    if (this.roleID != 6) {
      this.router.navigate(['/dashboard']);
    }

    this.initialiseForms();
  }

  initialiseForms() {
    this.spinnerService.show();
    this.addEmployeeForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.maxLength(45), Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      // NSIRSTaxPayerID: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(6), Validators.maxLength(6)]],
      nationality: ['Nigerian', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      startMonthId: ['', Validators.required],
      otherIncome: ['0', [Validators.pattern(/^[0-9\s]*$/)]],
      NHF: ['0', [Validators.pattern(/^[0-9\s]*$/)]],
      NHIS: ['0', [Validators.pattern(/^[0-9\s]*$/)]],
      CRA: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
      pension: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
      grossIncome: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
      taxYear: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(4), Validators.maxLength(4)]],
      taxMonthId: ['', Validators.required],
      BVN: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],
      employeeTIN: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(10), Validators.maxLength(10)]],
      // employeeTIN: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(10), Validators.maxLength(14)]],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(30)]],
      surname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(30)]],
      titleId: [''],
      designation: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(40)]],
      contactAddress: ['', [Validators.required, Validators.maxLength(80)]],
      // annualBasic: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
    });

    this.spinnerService.hide();
  }

  onSubmit(formAllData: any) {
    this.submitted = true;
    
    // stop the process here if form is invalid
    if (this.addEmployeeForm.invalid) {
      return;
    }

    let corporateId = localStorage.getItem('corporate_id');

    const obj = {
      tin: formAllData.employeeTIN,
      bvn: formAllData.BVN,
      nhis: formAllData.NHIS,
      nhf: formAllData.NHF,
      designation: formAllData.designation,
      title: formAllData.titleId,
      first_name: formAllData.firstName,
      last_name: formAllData.surname,
      email: formAllData.emailAddress,
      nationality: formAllData.nationality,
      tax_year: formAllData.taxYear,
      tax_month: formAllData.taxMonthId,
      zip_code: formAllData.zipCode,
      // annual_basic: formAllData.annualBasic,
      cra: formAllData.CRA,
      pension: formAllData.pension,
      gross_income: formAllData.grossIncome,
      other_income: formAllData.otherIncome,
      phone: formAllData.phoneNumber,
      start_month: formAllData.startMonthId,
      corporate_id: corporateId,
    };

    console.log('employeeFormData: ', obj);
    this.postCreateEmployee(obj);
  }


  postCreateEmployee(jsonData: any) {
    this.apiUrl = environment.AUTHAPIURL + 'employees';
    this.spinnerService.show();

    const reqHeader = new HttpHeaders({
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + localStorage.getItem('access_token')
     });

    this.httpClient.post<any>(this.apiUrl, jsonData, { headers: reqHeader }).subscribe(data => {
      console.log('employeeResponseData: ', data);

      if (data.status === true) {
        this.spinnerService.hide();
        // Rest form fithout errors
        this.addEmployeeForm.reset();
        this.addEmployeeForm.get('nationality').setValue('Nigerian');
        Object.keys(this.addEmployeeForm.controls).forEach(key => {
          this.addEmployeeForm.get(key).setErrors(null);
        });

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Employee has been saved successfully!',
          // text: data.response != null && data.response[0] != undefined ? data.response[0].message : data.message,
          showConfirmButton: true,
          timer: 5000
        });
        this.router.navigate(['/employeeschedule']);
      } else {

        this.spinnerService.hide();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:  data.response[0].message == '' || data.response[0].message == null ? 'Something went wrong, Please try again with correct employee details' : data.response[0].message,
          showConfirmButton: true,
          timer: 7000
        });
      }
    });
  }

}
