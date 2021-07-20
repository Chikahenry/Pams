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
  sampleTemplateForm: any;
  modalOptions: NgbModalOptions;
  testsForm: any;
  dtOptions: any = {};
  apiUrl: string;
  closeResult: string;
  samplingData: any;

  constructor(      
    private httpClient: HttpClient,
    private router: Router,
    private sess: SessionService,
    private modalService: NgbModal,
    private spinnerService: Ng4LoadingSpinnerService) { }

ngOnInit(): void {
this.sess.checkLogin(); 
this.getSamplings(); 
this.intialiseTableProperties();
console.log('token: ', localStorage.getItem('access_token'));

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

getSamplings() {
  // this.spinnerService.show();
  this.apiUrl = environment.AUTHAPIURL + 'Sample/getallsamplings';

  const reqHeader = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  });

  this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
  console.log('samplingData: ', data);
  this.spinnerService.hide();
  // this.samplingData = data.returnObject == null ? [] : data.returnObject;
  let types = [0]
  this.samplingData = data.returnObject.filter( i => types.includes( i.sampleType))
  });
}



}
