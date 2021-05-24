import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from '../../session.service';
import { environment } from '../../../environments/environment';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  apiUrl: any;

  roles: any;
  myroles: any;
  applications : any;
  myapplications : any;
  roleID: any;
  rolesArr: any;
  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router, private sess: SessionService, private flashMessage: FlashMessagesService, private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
     // Check User Login
     this.sess.checkLogin();
     
     this.roleID = localStorage.getItem('role_id');
     if(this.roleID!= 5) {
      this.router.navigate(['/dashboard']);
     }



     this.roleID = localStorage.getItem('role_id');
     if (this.roleID != 5) {
      this.router.navigate(['/logout']);
     }

     // this.getRole();
     this.getApplication();
     this.registerForm = this.formBuilder.group({
       name: ['', [Validators.required, Validators.maxLength(45), Validators.pattern('^[a-zA-Z ]*$')]],
       phone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^[0-9\s]*$/)]],
       email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
       role: ['', [Validators.required]],
   });
  }

  getRole() {
    this.apiUrl = environment.AUTHAPIURL + 'roles';
    return this.httpClient.get<any>(this.apiUrl)
            .subscribe(res => {
              console.log(res.response);
              this.roles = res.response;

              const arr = [];
              for (const obj of this.roles) {
                // console.log(obj);
                arr.push({
                  id: obj.id,
                  role_name: obj.role_name,
                  status: obj.status
                });
                this.myroles = arr;
              }

            });
  }

  getApplication() {
    this.apiUrl = environment.AUTHAPIURL + 'applications/1/roles';
    return this.httpClient.get<any>(this.apiUrl)
            .subscribe(res => {
              console.log(res.response);
              this.applications = res.response;
              this.roles = res.response;
              this.rolesArr = this.roles.shift();
              console.log(this.roles)

              const arr = [];
              for (const obj of this.applications) {
                // console.log(obj);
                arr.push({
                  id: obj.id,
                  application_name: obj.application_name,
                  status: obj.status
                });
                this.myapplications = arr;
              }

            });
  }



  onSubmit(formAllData: any) {
    this.submitted = true;
    // stop the process here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    
    console.log(formAllData);

    const obj = {
        name: formAllData.name,
        email: formAllData.email,
        phone: formAllData.phone,
        role_id: formAllData.role,
        taxpayer_type_id: localStorage.getItem('taxpayer_type_id')
        
        // admin_user_id: localStorage.getItem('id'),
        // admin_user_name: localStorage.getItem('username'),
        // admin_role: localStorage.getItem('role_name')
      };
    this.postData(obj);

  }

  postData(jsonData: any) {
    this.apiUrl = environment.AUTHAPIURL + 'users';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.spinnerService.show();

    this.httpClient.post<any>(this.apiUrl, jsonData, { headers: reqHeader }).subscribe(data => {
              console.log(data);
              // Rest form fithout errors
              this.registerForm.reset();
              Object.keys(this.registerForm.controls).forEach(key => {
                this.registerForm.get(key).setErrors(null) ;
              });

              // this.router.navigate(['/display']);
              if (data.status === true) {
                  this.spinnerService.hide();
                  // this.flashMessage.show(data.response, { cssClass: 'alert-success', timeout: 5000 });
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text:  'A new user has been added successfully',
                    showConfirmButton: true,
                    timer: 5000
                  });

              } else {
                  this.spinnerService.hide();
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text:  data.response != null && data.response[0] != undefined ? data.response[0].message : data.message,
                    showConfirmButton: true,
                    timer: 5000
                  });
              }
    });
  }

}
