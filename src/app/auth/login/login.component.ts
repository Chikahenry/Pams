import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from '../../session.service';
import { environment } from '../../../environments/environment';
import { FlashMessagesService } from 'angular2-flash-messages';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5/dist/md5';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  otpForm: FormGroup;
  submitted = false;
  iserror: any = false;
  errormsg: any;
  apiUrl: any;
  md5: any;
  appKey: any;
  appId: any;
  taxPayerTypes: any;
  showLoginForm: boolean = true;
  showOtpForm: boolean = false;
  requestObj: any;
  status: any;
  emailAddress: any;
  password: any;
  fieldTextType: boolean;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router,
              private sess: SessionService, 
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.islogin(); 
    localStorage.removeItem('otp_username');

    this.loginForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.maxLength(45), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
       
    }); 
  } 
 

  onSubmit(formAllData: any) {
    this.submitted = true;
     

    if (this.loginForm.invalid) {
      return;
    }

    this.emailAddress = formAllData.emailAddress;
    this.password = formAllData.password;
    // this.appId = environment.APPLICATION_ID;
 
    this.requestObj = {
      email: formAllData.emailAddress,
      password: formAllData.password, 
    };
    this.userLogin(this.requestObj);
    

  } 

  userLogin(jsonData: any) {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'account/signin';  
 
    this.http.post<any>(this.apiUrl, jsonData).subscribe(data => {

      console.log("loginApiResponse: ", data);
      this.status = data.status; 

        // this.spinnerService.hide();
        if (this.status == true) {
          localStorage.setItem('username', data.returnObject.email);
          localStorage.setItem('email', data.returnObject.email);
          localStorage.setItem('id', data.returnObject.userId);

          localStorage.setItem('access_token', data.returnObject.token);
  
          localStorage.setItem('fullname', data.returnObject.fullname);  

          this.spinnerService.hide();
          this.router.navigate(['/dashboard']);

        } else {
          this.spinnerService.hide();

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text:  data.message,
            showConfirmButton: true,
            timer: 5000
          });

        }

      
    });
  } 

}
