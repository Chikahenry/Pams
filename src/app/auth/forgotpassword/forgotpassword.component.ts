import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from '../../session.service';
import { environment } from '../../../environments/environment';
import { FlashMessagesService } from 'angular2-flash-messages';
import Swal from 'sweetalert2';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  requestOtpForm: FormGroup;
  submitted = false;
  iserror: any = false;
  errormsg: any;
  apiUrl: any;
  showForgotPasswordForm: boolean = false;
  showRequestOtpForm: boolean = true;
  emailAddress: any;
  fieldTextType: boolean;
  fieldTextType2: boolean;
  token: any;


  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, 
              private http: HttpClient, 
              private router: Router, 
              private sess: SessionService, 
              private flashMessage: FlashMessagesService,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.islogin();

    this.requestOtpForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.maxLength(45), Validators.email]],  
    });

    this.forgotPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      requestOtp: ['', Validators.required],
      // password: ['', Validators.required],
    });
  }

  onSubmit(formAllData: any) {
    this.submitted = true;  
 

    if (this.requestOtpForm.invalid) {
      return;
    }

    this.emailAddress = formAllData.emailAddress;
    
    const obj = {
      email: formAllData.emailAddress, 
    };

    console.log("forgotPasswordData: ", obj);
    this.requestNewOtp(obj);
  }

  requestNewOtp(otpObjData) {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'account/forgotpassword/' + this.emailAddress;

    this.http.post<any>(this.apiUrl, otpObjData).subscribe(data => {
      console.log("otpApiResponse: ", data);
      this.spinnerService.hide();

      if (data.status == true) {
        this.submitted = false;
        this.showRequestOtpForm = false;
        this.showForgotPasswordForm = true;

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'The OTP has been sent to mail successfully!',
          showConfirmButton: true,
          timer: 5000
        });

      } else {
        this.showRequestOtpForm = true;
        this.showForgotPasswordForm = false;

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message,
          showConfirmButton: true,
          timer: 5000
        });
      }

    });

  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  
  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  // toggleFieldTextType3() {
  //   this.fieldTextType3 = !this.fieldTextType3;
  // }

  onSubmitForgotPassword(formAllData) {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const obj = {
      email: this.emailAddress,
      password: formAllData.newPassword, 
      otp: formAllData.requestOtp,
    };

    console.log("forgotPasswordData: ", obj);
    this.confirmOTP(obj);
  }

  confirmOTP(jsondata) {
    this.spinnerService.show()
    this.apiUrl = environment.AUTHAPIURL + 'account/confirmotp?otp='+ jsondata.otp + '&email='+jsondata.email;

    this.http.post<any>(this.apiUrl, jsondata).subscribe(data => {
      console.log("qwerty",  data)
      this.spinnerService.hide()

      if(data.status == true) {
         
        this.token = data.returnObject.token
        const requestOjb = {
          email: this.emailAddress,
          password: jsondata.password,
          resetToken: this.token
        }
        this.postForgotPassword(requestOjb)

      }else{

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message,
          showConfirmButton: true,
          timer: 5000
        });
      }
    })
  }

  postForgotPassword(otpObjData) {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'account/resetpassword';

    this.http.post<any>(this.apiUrl, otpObjData).subscribe(data => {
      console.log("forgotPasswordApiResponse: ", data);
      this.spinnerService.hide();

      if (data.status == true) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message,
          showConfirmButton: true,
          timer: 5000
        });

        this.router.navigate(['/login']);
      } else {
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

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

}
