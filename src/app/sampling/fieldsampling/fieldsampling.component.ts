import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { types } from 'util';

@Component({
  selector: 'app-fieldsampling',
  templateUrl: './fieldsampling.component.html',
  styleUrls: ['./fieldsampling.component.scss']
})
export class FieldsamplingComponent implements OnInit {
  apiUrl: string;
  samplingData: any;
  dtOptions: any = {};
  modalOptions: NgbModalOptions;
  closeResult: string; 
  sampleTemplateForm: FormGroup; 
  submitted: boolean = false;
  selectedsampling: any;
  corporateLogo: any;
  sampleTemplateYear: string;
  sampleTemplateMonth: any;
  showPrintInvoice: boolean = false;
  sampleTemplateID: any; 
  testsForm: FormGroup;
  showSampleForm: boolean;
  sampleName: any;
  sampleType: any;
  showTestForm: boolean;
  testdata: {name: string; limit: string }[];
  clientName: any;
  singleSampleType: any;
  testTemplate: [];
  updateSampleTemplateForm: FormGroup;
  sampleTypeId: number;
  sampleId: any;
  singleClient: any;
  clientsData: any;
  clientId: any;
  clientSamples: any;
  tests: any;
  items: {
    limit: string,
    name: string,
    value: any
  }[] = [];
  limit : any;
  sampleData: any[] = [];
  sampleList: any;
  invoiceForm: FormGroup;
  invoiceItems: {
    name: string,
    amount: string
  }[] = [];
  samplingId: any;
  dueDateForm: FormGroup;
  invoiceExist: boolean;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private sess: SessionService,
              private modalService: NgbModal,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.checkLogin(); 
    this.getSamplings(); 
    this.intialiseTableProperties();
    // console.log('token: ', localStorage.getItem('access_token'));

  }
  initialiseForms() {
    this.sampleTemplateForm = this.formBuilder.group({
      name: ['', Validators.required],
      sampleType: ['', Validators.required], 
    });

    this.invoiceForm = this.formBuilder.group({
      amount: ['', Validators.required],
      sample: ['', Validators.required], 
    });

    this.dueDateForm = this.formBuilder.group({
      date: ['', Validators.required],
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
      // dom: '<\'row\'<\'col-sm-4\'l><\'col-sm-4 text-center\'B><\'col-sm-4\'f>>' + '<\'row\'<\'col-sm-12\'tr>>' + '<\'row\'<\'col-sm-5\'i><\'col-sm-7\'p>>',
      // buttons: [
      //           // { extend: 'copy',  className: 'btn btn-outline-dark', text: '<i class="far fa-copy"> Copy</i>' },
      //           // tslint:disable-next-line: max-line-length
      //           { extend: 'csv',   className: 'btn btn-outline-dark export-btn', text: '<i class="fas fa-file-csv"> CSV</i>', exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}},
      //           // tslint:disable-next-line: max-line-length
      //           { extend: 'excel', className: 'btn btn-outline-dark export-btn', text: '<i class="fas fa-file-excel"> Excel</i>', exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} },
      //           // tslint:disable-next-line: max-line-length
      //           { extend: 'pdf',   className: 'btn btn-outline-dark export-btn', text: '<i class="fas fa-file-pdf"> PDF</i>' , orientation: 'landscape', pageSize: 'LEGAL', exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}},
      //           // tslint:disable-next-line: max-line-length
      //           { extend: 'print', className: 'btn btn-outline-dark export-btn', text: '<i class="far fas fa-print"> Print</i>', exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } }
      //         ]
    };
  } 

  getSamplings() {
    // this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'Sample/GetAllSamplings';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('samplingData: ', data);
      this.spinnerService.hide();
      let types = 'Field'
      this.samplingData = data.returnObject.filter( c => c.samples.filter(m => m.sampleType == 0))
    });
  }

  getNumberOfSamplings(samplingId, sampleType){
    let sampling = this.samplingData.filter(m => m.id === samplingId)
     
    let sample = sampling[0].samples.filter(k => k.sampleType == 0)
  
    return sample.length
  
  }

  getClients() {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'client/getallclient';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('clientsData: ', data);
      this.spinnerService.hide();
      this.clientsData = data.returnObject == null ? [] : data.returnObject;

    });
  }
 
  viewAddLabtext(modal){
   this.showModal(modal)
    this.getClients()
 }

 viewTest(modal, sample){
   this.tests = sample.testTemplates
   this.testsForm = this.formBuilder.group({
     test: ['', Validators.required], 
     value: ['', Validators.required], 
   });
  this.showModal(modal)
  console.log("test ", this.tests)
  this.sampleName = sample.name
  this.testsForm = this.formBuilder.group({
    test: ['', Validators.required], 
    value: ['', Validators.required], 
  });
 }

 setLimit(){
   this.limit = "limit"
 }

 onSubmitTest(formData){
    this.submitted = true
    if(this.testsForm.invalid){
      return
    }
    this.setLimit()
    let obj = {
      limit: this.limit,
      name: formData.test,
      value: formData.value
    }
    
    if(this.items.some(d => d.name === obj.name)){
      this.items = this.items.filter(e => e.name !== obj.name)
      this.items.push(obj)
    }else{
      this.items.push(obj)
      
    }
   
      // Swal.fire({
      //   icon: "success",
      //   title: "Success",
      //   text: "Test Value save successfully",
      //   showConfirmButton: true,
      //   timer: 5000,
      // }); 
    
  
 }

 submitSample(){
   let obj = {
     name: this.sampleName,
     sampleType: 1,
     tests: this.items
   }
   if(this.sampleData.some(d => d.name === obj.name)){
      this.sampleData = this.sampleData.filter(e => e.name !== obj.name)
      this.sampleData.push(obj)
   }else {
     this.sampleData.push(obj)
     this.items = []
     console.log("samplejnl  ",this.sampleData)
     Swal.fire({
        icon: "success",
        title: "Success",
        text: "Test Value save successfully",
        showConfirmButton: true,
        timer: 5000,
      }); 
      document.getElementById("dismissBtn").click

   }
 }

 forwardSampling(){
   let date = new Date()
   const obj = {
     staffName: localStorage.getItem('fullname'),
     staffId: localStorage.getItem('id'),
     samplingTime: date,
     samplingDate: date,
     sampleType: 1,
     clientId:this.clientId,
     samples: this.sampleData
   }
   
   this.apiUrl = environment.AUTHAPIURL + 'sample/sampling';

  const reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  });

  this.httpClient.post<any>(this.apiUrl, obj, { headers: reqHeader }).subscribe(data => {
    console.log('clientsSampleData: ', data);
    
     if(data.status == true){
      Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        }); 
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

 removeTest(item) {
  this.items = this.items.filter(e => e !== item)

 }
 
 

 viewClient(modal, singleClient){
  this.showModal(modal)
  this.clientId = singleClient.id
  this.clientName = singleClient.name
  this.getClientSamples()
 }

 getClientSamples() { 
  this.apiUrl = environment.AUTHAPIURL + 'sample/clienttemplates/' + this.clientId;

  const reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  });

  this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
    console.log('clientsSampleData: ', data);
    this.clientSamples = data.returnObject == null ? [] : data.returnObject;
    this.clientSamples =this.clientSamples.filter(e => e.sampleType == 0)
     
  });
} 

  getClient(id) {
    this.apiUrl = environment.AUTHAPIURL + 'client/getclient/' + id;

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('singleClient: ', data);
      this.singleClient = data.returnObject == null ? [] : data.returnObject;
      // this.spinnerService.hide();
    });
    return this.singleClient?.name
  }

  viewSampling(modal, singleSampling) {
     
     
    this.showModal(modal)
    this.clientName = singleSampling.name
    this.singleSampleType = singleSampling.sampleType 
    this.testTemplate = singleSampling.testTemplates
    this.sampleId = singleSampling.id
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
