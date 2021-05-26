import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  apiUrl: string;
  clientsData: any;
  dtOptions: any = {};
  modalOptions: NgbModalOptions;
  closeResult: string; 
  clientForm: FormGroup; 
  submitted: boolean = false;
  selectedclient: any;  
  clientID: any; 
  sampleForm: FormGroup;
  showSampleForm: boolean;
  clientName: any; 
  singleClientName: any;  
  updatesamplesForm: FormGroup; 
  showClientForm: boolean;
  sampledata: any[]; 
  sampleTemplateData: any;
  sampleTemplate: any;
  address: any;
  email: any;
  clientEmail: any;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private sess: SessionService,
              private modalService: NgbModal,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.checkLogin(); 
    this.getclients(); 
    this.getSampleTemplates()
    this.intialiseTableProperties();
    console.log('token: ', localStorage.getItem('access_token'));

  }
  initialiseForms() {
    this.clientForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required], 
    });

    this.sampleForm = this.formBuilder.group({
      sample: ['', Validators.required], 
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

  getclients() {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'client/getallclient';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('clientsData: ', data);
      this.clientsData = data.returnObject == null ? [] : data.returnObject;
      this.spinnerService.hide();
    });
  }
 

  viewAddClient(modal){
    this.initialiseForms()
    this.showClientForm = true
    this.showSampleForm = false
    this.sampledata = []
    this.showModal(modal)
  }

  onSubmitClient(formAllData) {
   
    this.submitted  = true
    if(this.clientForm.invalid) {
      return
    }

     this.clientName = formAllData.name 
     this.address = formAllData.address 
     this.email = formAllData.email 

     this.showClientForm = false
     this.showSampleForm = true
     this.submitted = false
  }

  onSubmitSample(formAllData) {
    this.submitted  = true
    if(this.sampleForm.invalid) {
      return
    }

    let obj = formAllData.sample
    

     this.sampledata.push(obj)
     console.log("werty", this.sampledata)
     this.submitted = false
     this.sampleForm = this.formBuilder.group({
      sample: ['', Validators.required], 
    });
  }

  getSampleTemplates() { 
    this.apiUrl = environment.AUTHAPIURL + 'sample/sampleTemplates';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('clientsData: ', data);
      this.sampleTemplateData = data.returnObject == null ? [] : data.returnObject;
       
    });
  }
  
  createClient() {
    // this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'client/createclient';

    const jsondata = {
      name: this.clientName,
      email: this.email,
      address: this.address,
      sampleTemplateIDs: this.sampledata
    }
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.post<any>(this.apiUrl, jsondata, { headers: reqHeader }).subscribe(data => {
      console.log('singleclientData: ', data);
      
      if(data.status == true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        this.getclients();
      }else {
        Swal.fire({
          icon: "error",
          title: "Oop...",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        
      }
 
      this.spinnerService.hide();
    });
  }  

  deleteSample(test) {

  }
  onUpdateClient(formData) {

  }

  viewSingleClient(modal, singleclient) {
    this.updatesamplesForm = this.formBuilder.group({
      name: ['', Validators.required],
      limit: ['', Validators.required], 
    });
    this.showModal(modal)
    this.singleClientName = singleclient.name
    this.clientEmail = singleclient.email
    // this.testTemplate = singleclient.testTemplates
  }

  editTest(test) {
    this.updatesamplesForm = this.formBuilder.group({
      name: [test.name, Validators.required],
      limit: [test.limit, Validators.required], 
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
