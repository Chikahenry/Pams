import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.css']
})
export class AssessmentsComponent implements OnInit {
  apiUrl: string;
  assessmentsData: any;
  dtOptions: any = {};
  modalOptions: NgbModalOptions;
  closeResult: string;
  previewInvoice: boolean = false;
  paymentUrl: boolean = false;
  assessmentEmployeesData: any;
  assessmentForm: FormGroup;
  totalGrossIncome: any;
  totalMonthlyTaxDue: any;
  submitted: boolean = false;
  selectedAssessment: any;
  corporateLogo: any;
  assessmentYear: string;
  assessmentMonth: any;
  showPrintInvoice: boolean = false;
  assessmentID: any;
  apiPayment: any;
  apiInvoice: any;
  processInvoiceBtn: boolean = true;
  roleID: string;
  managerRole: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private sess: SessionService,
              private modalService: NgbModal,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.checkLogin();
    this.initialiseForms();
    this.getAssessments();
    this.roleID = localStorage.getItem('role_id');
    if(this.roleID === '5'){
      this.managerRole = true;
    }
    this.intialiseTableProperties();
    console.log('token: ', localStorage.getItem('access_token'));

  }

  intialiseTableProperties() {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      // size: 'lg'
      size: 'xl',
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
      dom: '<\'row\'<\'col-sm-4\'l><\'col-sm-4 text-center\'B><\'col-sm-4\'f>>' + '<\'row\'<\'col-sm-12\'tr>>' + '<\'row\'<\'col-sm-5\'i><\'col-sm-7\'p>>',
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
    this.assessmentForm = this.formBuilder.group({
      dateGenerated: [''],
      dueDate: [''],
      totalMonthlyTax: [''],
      assessmentStatus: [''],
      status: [''],
      companyName: [''],
      cacNumber: [''],
      taxPayerID: [''],
      phoneNumber: [''],
      // corporateId: [''],
    });
  }

  getAssessments() {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'assessments-list';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    let corporateId = localStorage.getItem('corporate_id');

    const obj = {
      corporate_ids: [corporateId],
    };

    this.httpClient.post<any>(this.apiUrl, obj, { headers: reqHeader }).subscribe(data => {
      console.log('assessmentsData: ', data);
      this.assessmentsData = data.response == null ? [] : data.response.data;
      this.spinnerService.hide();
    });
  }

  viewAssessment(modal, selectedAssessment) {
    console.log('selectedAssessment: ', selectedAssessment);
    this.assessmentYear = this.getTaxYear(selectedAssessment.due_date);
    this.assessmentMonth = this.getTaxMonth(selectedAssessment.due_date);
    this.totalMonthlyTaxDue = selectedAssessment.monthly_tax_due;
    this.showModal(modal);

    this.getSingleAssessment(selectedAssessment.id);
    this.assessmentID = selectedAssessment.id;
    // this.totalGrossIncome = this.assessmentEmployeesData.sum(x => x.gross_income);
    // this.totalMonthlyTaxDue = this.assessmentEmployeesData.sum(x => x.monthly_tax_due);
  }

  loadSelectedAssessmentData(selectedAssessment) {
    let assessmentStatus = selectedAssessment.status == 0 ? 'In Active' : 'Active';

    this.assessmentForm = this.formBuilder.group({
      dateGenerated: [selectedAssessment.created_at],
      dueDate: [selectedAssessment.due_date],
      totalMonthlyTax: [selectedAssessment.monthly_tax_due],
      assessmentStatus: [assessmentStatus],
      companyName: [selectedAssessment.corporate.company_name],
      cacNumber: [selectedAssessment.corporate.cac_number],
      taxPayerID: [selectedAssessment.corporate.taxpayer_id],
      phoneNumber: [selectedAssessment.corporate.phone],
      // corporateId: [selectedAssessment.corporate_id],
    });

    this.corporateLogo = selectedAssessment.corporate.corporate_logo;
    // this.assessmentEmployeesData = selectedAssessment.assessment_records;
  }

  processInvoice(){
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'invoices';

    const obj = {
      assessment_id: this.assessmentID
    }
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.post<any>(this.apiUrl, obj, { headers: reqHeader }).subscribe(data => {
      console.log('invoice: ', data);

      if(data.status == true){
        this.spinnerService.hide();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message,
          showConfirmButton: true,
          timer: 5000
        });

        this.previewInvoice = true;
        this.paymentUrl = true;
        this.apiInvoice = data.response.invoice.invoice_preview_url;
        this.apiPayment = data.response.invoice.payment_url;
      } else {
        this.spinnerService.hide();
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: data.message,
          showConfirmButton: true,
          timer: 5000
        });
      }
    });
  }
  getSingleAssessment(assessmentId) {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'assessments/' + assessmentId;

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('singleAssessmentData: ', data);
      this.selectedAssessment = data.response;
      this.assessmentEmployeesData = data.response.assessment_records;
      this.loadSelectedAssessmentData(this.selectedAssessment);

      if (data.response.invoice == null){
        this.processInvoiceBtn = true;
        this.previewInvoice = false;
        this.paymentUrl = false;
      } else if(data.response.invoice.payment_status == 0) {

        this.processInvoiceBtn = false;
        this.previewInvoice = true;
        this.paymentUrl = true;
        this.apiInvoice = data.response.invoice.invoice_preview_url;
        this.apiPayment = data.response.invoice.payment_url;

      } else if(data.response.invoice.payment_status == 1){

          this.processInvoiceBtn = false;
          this.previewInvoice = true;
          this.paymentUrl = true;
          this.apiInvoice = data.response.invoice.invoice_preview_url;
      }
      this.spinnerService.hide();
    });
  }

  getTaxYear(taxDueDate: string) : string {
    var taxYear = taxDueDate.split('-', 3)[0];
    return taxYear;
  }

  getTaxMonth(taxDueDate: string) : string {
    var taxMonth = taxDueDate.split('-', 3)[1];
    this.sess.getAllMonths();
    var monthName = this.sess.getMonthName(taxMonth);
    return monthName;
  }

  getEmployeesCount(employees: []) : Number {
    var employeesCount = employees.length;
    return employeesCount;
  }

  payForAssessment() {

  }

  showModal(modal) {
    this.modalService.open(modal, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

}
