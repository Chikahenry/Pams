import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../session.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-displayuser',
  templateUrl: './displayuser.component.html',
  styleUrls: ['./displayuser.component.css'],
})
export class DisplayuserComponent implements OnInit {
  apiUrl: string;
  apidata: any;
  dtOptions: any = {};
  activationForm : FormGroup;
  modalOptions: NgbModalOptions;
  closeResult: string;
  roleID: any;
  managerRole: boolean = false;
  noRole: boolean = false;
  userID: any;
  corporateId: any;
  submitted: boolean;
  // tslint:disable-next-line: max-line-length
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private sess: SessionService,
    private modalService: NgbModal,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    this.userID = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.sess.checkLogin();

    this.roleID = localStorage.getItem('role_id');
    // if (this.roleID != 1) {
    //   this.router.navigate(['/logout']);
    //  }
    if(this.roleID === '5') {
      this.managerRole = true;
    }  

    this.modalOptions = {
      backdrop: true,
      centered: true,
      backdropClass: "customBackdrop",
      // size: 'lg'
      size: "lg",
    };

    this.dtOptions = {
      paging: true,
      pagingType: 'full_numbers',
      responsive: true,
      pageLength: 10,
      lengthChange: true,
      processing: true,
      ordering: false,
      info: true,
      // dom: "<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      dom:
        '<\'row\'<\'col-sm-4\'l><\'col-sm-4 text-center\'B><\'col-sm-4\'f>>' +
        '<\'row\'<\'col-sm-12\'tr>>' +
        '<\'row\'<\'col-sm-5\'i><\'col-sm-7\'p>>',
      buttons: [
        // { extend: 'copy',  className: 'btn btn-outline-dark', text: '<i class="far fa-copy"> Copy</i>' },
        {
          extend: 'csv',
          className: 'btn btn-outline-dark export-btn',
          text: '<i class="fas fa-file-csv"> CSV</i>',
        },
        {
          extend: 'excel',
          className: 'btn btn-outline-dark export-btn',
          text: '<i class="fas fa-file-excel"> Excel</i>',
        },
        // tslint:disable-next-line: max-line-length
        {
          extend: 'pdf',
          className: 'btn btn-outline-dark export-btn',
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: 'landscape',
          pageSize: 'LEGAL',
        },
        // { extend: 'print', className: 'btn btn-outline-dark', text: '<i class="far fas fa-print"> Print</i>' }
      ],
    };

    this.activationForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.maxLength(45), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      // password: ['', [Validators.required, Validators.minLength(6)]],
       
    });
  }

  onSubmit(formAllData: any) {
    this.submitted = true;
    
    // stop the process here if form is invalid
    if (this.activationForm.invalid) {
      return;
    }
 
    const obj = {
      email: formAllData.emailAddress
    }; 
    this.postActivation(obj);
  }


  postActivation(jsonData: any) {
    this.apiUrl = environment.AUTHAPIURL + 'account/generateactivationcode/'+ jsonData.email;
    this.spinnerService.show();

    const reqHeader = new HttpHeaders({
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + localStorage.getItem('access_token')
     });

    this.httpClient.post<any>(this.apiUrl, jsonData, { headers: reqHeader }).subscribe(data => {
      console.log('reponseData: ', data);

      if (data.status == true) {
        this.spinnerService.hide(); 
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message,
          showConfirmButton: true,
          timer: 5000
        });
        // this.router.navigate(['/employeeschedule']);
      } else {

        this.spinnerService.hide();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:  data.message,
          showConfirmButton: true,
          timer: 7000
        });
      }
    });
  }
 
  getUserData() {
    this.apiUrl = environment.AUTHAPIURL + 'users-list';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    });

    this.spinnerService.show();
    // this.httpClient
    // .post<any>(this.apiUrl, { headers: reqHeader })
    // .subscribe((data) => {

    this.httpClient.post<any>(this.apiUrl, {}, { headers: reqHeader }).subscribe(data => {
      console.log(data);
      this.apidata = data.response.data;
      this.spinnerService.hide();
      });
  }

  changeStatus(user_Id: any, status: number) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    });

    // alert(id);
    let newstatus = '';
    if (status === 1) {
      newstatus = '0';
    } else {
      newstatus = '1';
    }
    const obj = {
      id: user_Id,
      active: newstatus,
      // admin_user_id: localStorage.getItem('id'),
      // admin_user_name: localStorage.getItem('username'),
      // admin_role: localStorage.getItem('role_name')
    };

    this.apiUrl = environment.AUTHAPIURL + 'users/update';
    this.spinnerService.show(); // show the spinner
    this.httpClient
      .post<any>(this.apiUrl, obj, { headers: reqHeader })
      .subscribe((data) => {
        console.log(data);
        this.apidata = data.response;
        this.getUserData();
        this.spinnerService.hide(); // hide the spinner if success
      });
  }

  deleteUser(id: number) {
    const obj = {
      user_id: this.userID,
    };

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    });

    this.apiUrl = environment.AUTHAPIURL + 'users/' + id;
    this.httpClient
      .delete<any>(this.apiUrl, { headers: reqHeader })
      .subscribe(() => {
        console.log();
        // Swal.fire('Oops...', 'Something went wrong!', 'error');
        Swal.fire({
          icon: 'success',
          title: 'User Successfully Deleted',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/displayuser']);
        this.getUserData();
      });
  }

  viewActivationModal(modal) {
    this.showModal(modal)
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
