import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
// import { timeStamp } from 'console';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  apiUrl: string;
  reportData: any;
  dtOptions: any = {};
  modalOptions: NgbModalOptions;
  closeResult: string; 
  sampleTemplateForm: FormGroup; 
  submitted: boolean = false;  
  items: {
    limit: string,
    name: string,
    value: any
  }[] = []; 
  sampleData: any[] = [];
  selectedInvoice: any;
  reportId: any;
  invoicePaid: boolean;
  paid: boolean;
  clientName: any;
  clientSamplings: any; 

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private sess: SessionService,
              private modalService: NgbModal,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    // this.date = new Date()
    this.sess.checkLogin(); 
    this.getReports(); 
    this.intialiseTableProperties();
    // console.log('token: ', localStorage.getItem('access_token'));

  }
  initialiseForms() {
    this.sampleTemplateForm = this.formBuilder.group({
      name: ['', Validators.required],
      sampleType: ['', Validators.required], 
    });
 
  } 

  intialiseTableProperties() {
    this.modalOptions = {
      backdrop: true,
      centered: true,
      backdropClass: "customBackdrop",
      // size: 'lg'
      size: "lg",
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

  getReports() {
    // this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'report/allreports';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('reportsData: ', data);
      this.spinnerService.hide();
      this.reportData = data.returnObject == null ? [] : data.returnObject;
    });
  }

  downloadReport(reportId){
    this.reportId = reportId
    this.apiUrl = environment.AUTHAPIURL + 'report/downloadreport/' + this.reportId;

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
     //  console.log('clientsData: ', data);
      this.spinnerService.hide();
      if(data.status == true){
        Swal.fire({
            icon: "success",
            title: "Success",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          }); 
          
          this.getReports()
       }else {
        Swal.fire({
            icon: "error",
            title: "Oop...",
            text: data.message,
            showConfirmButton: true,
            timer: 7000,
          }); 
       }
 
    });
  }
}
