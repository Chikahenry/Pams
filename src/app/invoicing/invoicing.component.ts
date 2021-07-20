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
  selector: 'app-invoicing',
  templateUrl: './invoicing.component.html',
  styleUrls: ['./invoicing.component.scss']
})
export class InvoicingComponent implements OnInit {
  apiUrl: string;
  invoicesData: any;
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
  invoiceId: any;
  invoicePaid: boolean;
  paid: boolean;
  clientName: any;
  clientSamplings: any;
  date: Date;
  reportForm: FormGroup;
  microbialGroup: boolean;
  unit: boolean;
  limit: boolean;
  microbiologicalData: {}[] = [];
  testMethod: boolean;
  result: boolean;
  physicoChemicalData: {}[] = [];
  testAndUnit: boolean;
  uc: boolean;
  limitPH: boolean;
  resultPH: boolean;
  testMethodPH: boolean;
  clientId: any;
  samplingId: any;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private sess: SessionService,
              private modalService: NgbModal,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.date = new Date()
    this.sess.checkLogin(); 
    this.getInvoices(); 
    this.intialiseTableProperties();
    // console.log('token: ', localStorage.getItem('access_token'));

  }
  initialiseForms() {
    this.sampleTemplateForm = this.formBuilder.group({
      name: ['', Validators.required],
      sampleType: ['', Validators.required], 
    });
 
  }

  initReportForm(){
    this.reportForm = this.formBuilder.group({
      sampleRefNumber: ['', Validators.required],
      sampleType: ['', Validators.required], 
      sampleLabel: ['', Validators.required], 
      batchNumber: ['', Validators.required], 
      dateRecieved: ['', Validators.required], 
      dateAnalysed: ['', Validators.required], 
      temperature: ['', Validators.required], 
      humidity: ['', Validators.required], 
      certificateNumber: ['', Validators.required], 
      comment: ['', Validators.required], 
      result: [''],
      resultPH: [''],
      unit: [''],
      limit: [''],
      limitPH: [''],
      microbialGroup: [''],
      testAndUnit: [''],
      testMethod: [''],
      testMethodPH: [''],
      uc: [''],
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

  getInvoices() {
    // this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'invoice/invoices';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('invoicesData: ', data);
      this.spinnerService.hide();
      this.invoicesData = data.returnObject == null ? [] : data.returnObject;
    });
  }
  // getClients() {
  //   this.spinnerService.show();
  //   this.apiUrl = environment.AUTHAPIURL + 'client/getallclient';

  //   const reqHeader = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  //   });
  
  //   this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
  //     console.log('clientsData: ', data);
  //     this.spinnerService.hide();
  //     this.clientsData = data.returnObject == null ? [] : data.returnObject;

  //   });
  // }
  

 viewUpdateStatus(modal, invoice){
  this.showModal(modal)
  this.selectedInvoice = invoice
 }

 generateReport(modal, clientId){
   this.initReportForm()
   this.getClientSamplings(clientId)
  this.showModal(modal)
  
}

getClientSamplings(clientId){
  this.apiUrl = environment.AUTHAPIURL + 'sample/samplings/' + clientId;

   const reqHeader = new HttpHeaders({
     'Content-Type': 'application/json',
     'Authorization': 'Bearer ' + localStorage.getItem('access_token')
   });
 
   this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
     console.log('clientsamplings: ', data);
     this.spinnerService.hide();
     if(data.status == true){
        this.clientSamplings = data.returnObject
        this.clientId = data.returnObject[0].id
        this.clientName = data.returnObject[0].clientName
        this.samplingId = data.returnObject[0].id
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

 updateStatus(){
   this.invoiceId = this.selectedInvoice.id
  this.apiUrl = environment.AUTHAPIURL + 'invoice/pay/' + this.invoiceId;

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      // console.log('clientsData: ', data);
      this.spinnerService.hide();
      if(data.status == true){
        Swal.fire({
            icon: "success",
            title: "Success",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          }); 
          this.paid = true
          this.invoicePaid = true
          this.getInvoices()
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

 sendEmail(invoiceId){
  this.invoiceId = invoiceId
 this.apiUrl = environment.AUTHAPIURL + 'invoice/sendinvoice/' + this.invoiceId;

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
         this.paid= true
         this.invoicePaid = true
         this.getInvoices()
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

download(invoiceId){
  this.invoiceId = invoiceId
 this.apiUrl = environment.AUTHAPIURL + 'invoice/downloadinvoice/' + this.invoiceId;

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
         
         this.getInvoices()
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

addMicrobial(){
  let microbialGroup = this.reportForm.get('microbialGroup').value;
		let unit = this.reportForm.get('unit').value;
		let limit = this.reportForm.get('limit').value;
		let result = this.reportForm.get('result').value;
		let testMethod = this.reportForm.get('testMethod').value;

		if (microbialGroup == '') {
			this.microbialGroup = true;
		} else if (unit == '') {
			this.unit = true;
		} else if (limit == '') {
			this.limit = true;
		} else if (result == '') {
      this.result = true;
    } else if (testMethod == '') {
      this.testMethod = true;
    } else {
			let newPhysicoChemical = {
				microbial_Group: this.reportForm.get('microbialGroup').value,
				unit: this.reportForm.get('unit').value,
				limit: this.reportForm.get('limit').value,
				result: this.reportForm.get('result').value,
				test_Method: this.reportForm.get('testMethod').value,
			};
			this.microbiologicalData.push(newPhysicoChemical);
			// this.noDestination = false;
			this.microbialGroup = false;
			this.unit = false;
			this.limit = false;
			this.testMethod = false;
			this.result = false;
		}
		this.reportForm.get('microbialGroup').setValue('');
		this.reportForm.get('unit').setValue('');
		this.reportForm.get('limit').setValue('');
		this.reportForm.get('result').setValue('');
		this.reportForm.get('testMethod').setValue('');
}

addPhysicoChemical(){
  let testAndUnit = this.reportForm.get('testAndUnit').value;
  let uc = this.reportForm.get('uc').value;
  let limitPH = this.reportForm.get('limitPH').value;
  let resultPH = this.reportForm.get('resultPH').value;
  let testMethodPH = this.reportForm.get('testMethodPH').value;

  if (testAndUnit == '') {
    this.testAndUnit = true;
  } else if (uc == '') {
    this.uc = true;
  } else if (limitPH == '') {
    this.limitPH = true;
  } else if (resultPH == '') {
    this.resultPH = true;
  } else if (testMethodPH == '') {
    this.testMethodPH = true;
  } else {
    let newPhysicoChemical = {
      test_Performed_And_Unit: this.reportForm.get('testAndUnit').value,
      uc: this.reportForm.get('uc').value,
      limit: this.reportForm.get('limitPH').value,
      result: this.reportForm.get('resultPH').value,
      test_Method: this.reportForm.get('testMethodPH').value,
    };
    this.physicoChemicalData.push(newPhysicoChemical);
    // this.noDestination = false;
    this.testAndUnit = false;
    this.uc = false;
    this.limitPH = false;
    this.testMethodPH = false;
    this.resultPH = false;
  }
  this.reportForm.get('testAndUnit').setValue('');
  this.reportForm.get('uc').setValue('');
  this.reportForm.get('limitPH').setValue('');
  this.reportForm.get('resultPH').setValue('');
  this.reportForm.get('testMethodPH').setValue('');
}

removePhysicoChemicalData(data){
  this.physicoChemicalData = this.physicoChemicalData.filter((e) => e !== data);
}

removeMicrobialData(data){
  this.microbiologicalData = this.microbiologicalData.filter((e) => e !== data);
}

submitReportForm(formData){
  this.submitted = true
  if (this.reportForm.invalid || this.physicoChemicalData.length < 0 || this.microbiologicalData.length < 0){
    Swal.fire({
      icon: "error",
      title: "Oop...",
      text: 'Please do well to fill all required field',
      showConfirmButton: true,
      timer: 7000,
    }); 
    return
  }
  const obj = {
    clientID: this.clientId,
    samplingID: this.samplingId,
    lab_Sample_Ref_Number: formData.sampleRefNumber,
    certificate_Number: formData.certificateNumber,
    sample_Label: formData.sampleLabel,
    date_Recieved_In_Lab: formData.dateRecieved,
    date_Analysed_In_Lab: formData.dateAnalysed,
    batch_Number: formData.batchNumber,
    sample_Type: formData.sampleType,
    comment: formData.comment,
    microBiologicalAnalyses: this.microbiologicalData,
    physicoChemicalAnalyses: this.physicoChemicalData, 
    lad_Env_Con: {
      humidity: formData.humidity,
      temperature: formData.temperature
    },
    lab_Analyst: localStorage.getItem('fullname')
  }

  this.apiUrl = environment.AUTHAPIURL + 'report/create' ;

   const reqHeader = new HttpHeaders({
     'Content-Type': 'application/json',
     'Authorization': 'Bearer ' + localStorage.getItem('access_token')
   });
 
   this.httpClient.post<any>(this.apiUrl, obj, { headers: reqHeader }).subscribe(data => {
     console.log('clientsamplings: ', data);
     this.spinnerService.hide();
     if(data.status == true){
      Swal.fire({
        icon: "success",
        title: "Success",
        text: data.message,
        showConfirmButton: true,
        timer: 4000,
      }); 
        // this.clientSamplings = data.returnObject
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
