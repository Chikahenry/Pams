import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { UserService } from 'services/user.service';
import { SessionService } from '../../session.service';
import { environment } from '../../../environments/environment';
import { FlashMessagesService } from 'angular2-flash-messages';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5/dist/md5';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
 
  apiUrl: string;  
  registerForm: FormGroup; 
  submitted = false; 

  constructor(private formBuilder: FormBuilder, 
              private http: HttpClient, 
              private router: Router,  
              private sess: SessionService, 
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.sess.islogin();
    this.spinnerService.show(); 
    this.initialiseForms(); 
    this.spinnerService.hide();
  }

  initialiseForms() { 
    this.registerForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.maxLength(60), Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      firstname: ['', [Validators.required, Validators.pattern('^[A-Za-z 0-9 _-]*[A-Za-z0-9][A-Za-z0-9 _]*$'), Validators.maxLength(60)]],
      lastname: ['', [Validators.required, Validators.pattern('^[A-Za-z 0-9 _-]*[A-Za-z0-9][A-Za-z0-9 _]*$'), Validators.maxLength(60)]],
      phone: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern('^[0-9]*$')]],
      activationCode: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]*$')]],
      password: ['', Validators.required], 
    });
  }
 

  onRegisterSubmit(formData) {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    var requestObj = { 
      activationCode: formData.activationCode,
      password: formData.password,
      phoneNumber: formData.phone, 
      email: formData.emailAddress, 
      firstName: formData.firstname, 
      lastName: formData.lastname, 
    };

    console.log('registerRequest: ', requestObj);
    this.apiUrl = environment.AUTHAPIURL + 'account/signup';

    this.http.post<any>(this.apiUrl, requestObj).subscribe(data => {
      console.log('registerApiResponse: ', data);
      this.spinnerService.hide();    

      if (data.status == true) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message,
          showConfirmButton: true,
          timer: 5000
        });
        
        localStorage.setItem('username', formData.emailAddress);

        this.router.navigate(['/login']);
       
      } else {
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
 

}
