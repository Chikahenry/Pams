import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employeeschedule',
  templateUrl: './employeeschedule.component.html',
  styleUrls: ['./employeeschedule.component.css']
})
export class EmployeescheduleComponent implements OnInit {
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
  selectedEmployee: any;
  forwardScheduleForm: FormGroup;
  showCreateSchedule: boolean = false;
  showEditEmployee: boolean = false;
  showDeleteEmployee: boolean = false;
  showSaveEmployee: boolean = false;
  apidataEmpty: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private sess: SessionService,
              private modalService: NgbModal,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.checkLogin();
    this.initialiseForms();
    this.getEmployees();
    var userRole = localStorage.getItem('role_id');
    // console.log("userRole: ", userRole);

    if (userRole == "6") {
      this.showCreateSchedule = true;
      this.showEditEmployee = true;
      this.showDeleteEmployee = true;
      this.showSaveEmployee = true;
    }

    console.log("token: ", localStorage.getItem('access_token'));
    // this.spinnerService.hide();

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
      // size: 'xl',
    };

    this.dtOptions = {
      paging: true,
      scrollX: true,
      pagingType: 'full_numbers',
      responsive: true,
      pageLength: 10,
      lengthChange: true,
      processing: true,
      ordering: false,
      info: true,
      columnDefs: [
        {
            //targets: [ 10 ],
            visible: false,
            searchable: false
        }
    ],
      // dom: "<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      buttons: [
                // { extend: 'copy',  className: 'btn btn-outline-dark', text: '<i class="far fa-copy"> Copy</i>' },
                // tslint:disable-next-line: max-line-length
                { extend: 'csv',   className: 'btn btn-outline-dark export-btn', text: '<i class="fas fa-file-csv"> CSV</i>', exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}},
                // tslint:disable-next-line: max-line-length
                { extend: 'excel', className: 'btn btn-outline-dark export-btn', text: '<i class="fas fa-file-excel"> Excel</i>', exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} },
                // tslint:disable-next-line: max-line-length
                { extend: 'pdf',   className: 'btn btn-outline-dark export-btn', text: '<i class="fas fa-file-pdf"> PDF</i>' , orientation: 'landscape', pageSize: 'LEGAL', exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}},
                // tslint:disable-next-line: max-line-length
                { extend: 'print', className: 'btn btn-outline-dark export-btn', text: '<i class="far fas fa-print"> Print</i>', exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } }
              ]
    };
  
  }

  initialiseForms() {
    this.addEmployeeForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.maxLength(60), Validators.email]],
      NSIRSTaxPayerID: [''],
      zipCode: ['', [Validators.pattern(/^[0-9\s]*$/)]],
      nationality: ['', Validators.required],
      startMonthId: ['', Validators.required],
      otherIncome: ['', [Validators.pattern(/^[0-9\s]*$/)]],
      NHF: ['', [Validators.pattern(/^[0-9\s]*$/)]],
      NHIS: ['', [Validators.pattern(/^[0-9\s]*$/)]],
      CRA: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
      pension: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
      grossIncome: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
      taxYear: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(4), Validators.maxLength(4)]],
      taxMonthId: ['', Validators.required],
      BVN: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(13), Validators.maxLength(13)]],
      employeeTIN: ['', Validators.required],
      // employeeTIN: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(10), Validators.maxLength(10)]],
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      titleId: [''],
      designation: ['', Validators.required],
      // annualBasic: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
    });

    this.forwardScheduleForm = this.formBuilder.group({
      scheduleYear: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(4), Validators.maxLength(4)]],
      scheduleMonthId: ['', Validators.required],
      comment: ['', Validators.required],
    });

  }

  onSubmit(formAllData: any) {
    this.submitted = true;
    
    // stop the process here if form is invalid
    if (this.addEmployeeForm.invalid) {
      return;
    }

    let corporateId = localStorage.getItem('corporate_id');

    const obj = {
      id: this.selectedEmployee.id,
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

    console.log("employeeFormData: ", obj);
    this.postUpdateEmployee(obj);
  }

  addEmployee(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  viewEmployee(modal, selectedEmployee) {
    console.log("selectedEmployee: ", selectedEmployee);
    this.showSaveEmployee = false;
    this.showModal(modal);
    this.getSingleEmployee(selectedEmployee.id);
    // this.selectedEmployee = this.getSingleEmployee(selectedEmployee.id);
    
  }

  editEmployee(modal, selectedEmployee) {
    console.log("selectedEmployee: ", selectedEmployee);
    this.showSaveEmployee = true;
    this.showModal(modal);
    this.getSingleEmployee(selectedEmployee.id);    
  }

  loadSelectedEmployeeData(selectedEmployee) {
    this.addEmployeeForm = this.formBuilder.group({
      emailAddress: [selectedEmployee.email, [Validators.required, Validators.maxLength(60), Validators.email]],
      NSIRSTaxPayerID: [selectedEmployee.taxpayer_id],
      zipCode: [selectedEmployee.zip_code, [Validators.pattern(/^[0-9\s]*$/)]],
      nationality: [selectedEmployee.nationality, Validators.required],
      startMonthId: [selectedEmployee.start_month, Validators.required],
      otherIncome: [selectedEmployee.other_income, [Validators.pattern(/^[0-9\s]*$/)]],
      NHF: [selectedEmployee.nhf, [Validators.pattern(/^[0-9\s]*$/)]],
      NHIS: [selectedEmployee.nhis, [Validators.pattern(/^[0-9\s]*$/)]],
      CRA: [selectedEmployee.cra, [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
      pension: [selectedEmployee.pension, [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
      grossIncome: [selectedEmployee.gross_income, [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
      // tslint:disable-next-line: max-line-length
      taxYear: [selectedEmployee.tax_year, [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(4), Validators.maxLength(4)]],
      taxMonthId: [selectedEmployee.tax_month, Validators.required],
      // tslint:disable-next-line: max-line-length
      BVN: [selectedEmployee.bvn, [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(13), Validators.maxLength(13)]],
      employeeTIN: [selectedEmployee.tin, Validators.required],
      // tslint:disable-next-line: max-line-length
      phoneNumber: [selectedEmployee.phone, [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(10), Validators.maxLength(10)]],
      firstName: [selectedEmployee.first_name, Validators.required],
      surname: [selectedEmployee.last_name, Validators.required],
      titleId: [selectedEmployee.title],
      designation: [selectedEmployee.designation, Validators.required],
      // annualBasic: [selectedEmployee.annual_basic, [Validators.required, Validators.pattern(/^[0-9\s]*$/)]],
    });
  }

  showModal(modal) {
    this.modalService.open(modal, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getSingleEmployee(employeeId) {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'employees/' + employeeId;

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log("singleEmployeeData: ", data);
      this.loadSelectedEmployeeData(data.response);
      this.selectedEmployee = data.response;
      this.spinnerService.hide();
    });
  }

  postUpdateEmployee(jsonData: any) {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'employees/update';

    const reqHeader = new HttpHeaders({
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + localStorage.getItem('access_token')
     });

    this.httpClient.post<any>(this.apiUrl, jsonData, { headers: reqHeader }).subscribe(data => {
      console.log("employeeResponseData: ", data);

      if (data.status === true) {
        // Rest form fithout errors
        this.addEmployeeForm.reset();

        Object.keys(this.addEmployeeForm.controls).forEach(key => {
          this.addEmployeeForm.get(key).setErrors(null);
        });

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: "Employee has been updated successfully!",
          // text: data.response != null && data.response[0] != undefined ? data.response[0].message : data.message,
          showConfirmButton: true,
          timer: 5000
        });

        this.spinnerService.hide();
        this.modalService.dismissAll();
        this.getEmployees();

      } else {
        this.spinnerService.hide();

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:  data.response != null ? data.response[0].message : data.message,
          showConfirmButton: true,
          timer: 5000
        });
      }
    });
  }

  getEmployees() {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'employees-list';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    let corporateId = localStorage.getItem('corporate_id');

    const obj = {
      corporate_ids: [corporateId],
    };

    this.httpClient.post<any>(this.apiUrl, obj, { headers: reqHeader }).subscribe(data => {
      console.log("employeesData: ", data);
      this.employeesData = data.response.data == null ? [] : data.response.data;
      if(data.response.data.length > 0){
        this.apidataEmpty = true;
      }
      this.spinnerService.hide();
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


  forwardSchedule(modal) {
    this.modalService.open(modal, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSubmitSchedule(formAllData: any) {
    this.submitted = true;
    
    // stop the process here if form is invalid
    if (this.forwardScheduleForm.invalid) {
      return;
    }

    let corporateId = localStorage.getItem('corporate_id');

    const obj = {
      comment: formAllData.comment,
      due_date: formAllData.scheduleYear + "-" + formAllData.scheduleMonthId,
      corporate_ids: [corporateId],
    };

    console.log("scheduleFormData: ", obj);
    this.postForwardSchedule(obj);
  }

  postForwardSchedule(jsonData: any) {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'schedules/forward';

    const reqHeader = new HttpHeaders({
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + localStorage.getItem('access_token')
     });

    this.httpClient.post<any>(this.apiUrl, jsonData, { headers: reqHeader }).subscribe(data => {
      console.log("scheduleApiResponseData: ", data);

      if (data.status === true) {
        // Rest form fithout errors
        this.forwardScheduleForm.reset();
        Object.keys(this.forwardScheduleForm.controls).forEach(key => {
          this.forwardScheduleForm.get(key).setErrors(null);
        });

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Schedule Forawarded Successfully to Manager',
          showConfirmButton: true,
          timer: 5000
        });

        this.spinnerService.hide();
        this.modalService.dismissAll();
        this.getEmployees();

      } else {
        this.spinnerService.hide();

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:  data.response != null && data.response[0] != undefined ? data.response[0].message : data.message,
          showConfirmButton: true,
          timer: 7000
        });
      }
    });
  }

  deleteEmployee(id: number) {
    let corporateId = localStorage.getItem('corporate_id');
    this.spinnerService.show();

    const obj = {
      corporate_ids: [corporateId],
      id: id,
    };

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    });

    this.apiUrl = environment.AUTHAPIURL + 'employees/delete';

    this.httpClient.post<any>(this.apiUrl, obj, { headers: reqHeader }).subscribe(data => {
      console.log("deleteApiResponseData: ", data);

      if (data.status === true) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text:  'Employee has been successfully deleted!',
          showConfirmButton: true,
          timer: 5000,
        });

        this.getEmployees();
        this.spinnerService.hide();
        this.modalService.dismissAll();
      }
      else {
        this.spinnerService.hide();

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:  'An error ocurred while trying to delete Employee!',
          showConfirmButton: true,
          timer: 5000
        });
      }
      
    });
  }

  // open(content, userDataID) {
  //   // alert(userDataID);
  //   console.log(userDataID);
  //   this.userID = userDataID;

  //   this.getUserDataById(userDataID);

  //   this.modalService.open(content, this.modalOptions).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

}
