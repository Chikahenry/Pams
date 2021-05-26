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
  selector: 'app-sampleTemplate',
  templateUrl: './sampleTemplate.component.html',
  styleUrls: ['./sampleTemplate.component.scss']
})
export class SampleTemplateComponent implements OnInit {
  apiUrl: string;
  sampletemplatesData: any;
  dtOptions: any = {};
  modalOptions: NgbModalOptions;
  closeResult: string; 
  sampleTemplateForm: FormGroup; 
  submitted: boolean = false;
  selectedsampleTemplate: any;
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
  testdata: {}[];
  singleSampleName: any;
  singleSampleType: any;
  testTemplate: [];
  updateTestsForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private sess: SessionService,
              private modalService: NgbModal,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.checkLogin(); 
    this.getsampletemplates(); 
    this.intialiseTableProperties();
    console.log('token: ', localStorage.getItem('access_token'));

  }
  initialiseForms() {
    this.sampleTemplateForm = this.formBuilder.group({
      name: ['', Validators.required],
      sampleType: ['', Validators.required], 
    });

    this.testsForm = this.formBuilder.group({
      name: ['', Validators.required],
      limit: ['', Validators.required], 
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

  getsampletemplates() {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'Sample/sampleTemplates';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('sampletemplatesData: ', data);
      this.sampletemplatesData = data.returnObject == null ? [] : data.returnObject;
      this.spinnerService.hide();
    });
  }
 

  viewAddSampleTemplate(modal){
    this.initialiseForms()
    this.showSampleForm = true
    this.testdata = []
    this.showModal(modal)
  }

  onSubmitSample(formAllData) {
   
    this.submitted  = true
    if(this.sampleTemplateForm.invalid) {
      return
    }

     this.sampleName = formAllData.name
     this.sampleType = formAllData.sampleType

     this.showSampleForm = false
     this.showTestForm = true
     this.submitted = false
  }

  onSubmitTest(formAllData) {
    this.submitted  = true
    if(this.testsForm.invalid) {
      return
    }

    let obj = {
      name: formAllData.name,
      limit: formAllData.limit

    }

     this.testdata.push(obj)
     console.log("werty", this.testdata)
     this.submitted = false
     this.testsForm = this.formBuilder.group({
      name: ['', Validators.required],
      limit: ['', Validators.required], 
    });
  }
  
  createSampleTemplate() {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'sample/sampletemplate';

    const jsondata = {
      name: this.sampleName,
      sampleType: this.sampleType,
      tests: this.testdata
    }
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.post<any>(this.apiUrl, jsondata, { headers: reqHeader }).subscribe(data => {
      console.log('singlesampleTemplateData: ', data);
      
      if(data.status == true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        this.getsampletemplates();
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

  deleteTest(test) {

  }

  viewSingleSample(modal, singlesampleTemplate) {
    this.updateTestsForm = this.formBuilder.group({
      name: ['', Validators.required],
      limit: ['', Validators.required], 
    });
    this.showModal(modal)
    this.singleSampleName = singlesampleTemplate.name
    this.singleSampleType = singlesampleTemplate.sampleType
    this.testTemplate = singlesampleTemplate.testTemplates
  }

  editTest(test) {
    this.updateTestsForm = this.formBuilder.group({
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
