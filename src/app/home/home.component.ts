import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  newsletterForm: FormGroup;
  submitted = false;
  apiUrl: any;

  roles: any;
  myroles: any;
  roleID: any;
  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private sess: SessionService,
              private flashMessage: FlashMessagesService,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
     
     this.newsletterForm = this.formBuilder.group({
       email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
   });
  }

  onSubmit(formAllData: any) {
    this.submitted = true;
    // stop the process here if form is invalid
    if (this.newsletterForm.invalid) {
        return;
    }
    
    console.log(formAllData);

    const obj = {
        email: formAllData.email

      };
    this.postData(obj);

  }

  postData(jsonData: any) {
    this.apiUrl = environment.AUTHAPIURL + 'newsletter/subscribe';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.spinnerService.show();

    this.httpClient.post<any>(this.apiUrl, jsonData, { headers: reqHeader }).subscribe(data => {
              console.log(data);
              // Rest form fithout errors
              this.newsletterForm.reset();
              Object.keys(this.newsletterForm.controls).forEach(key => {
                this.newsletterForm.get(key).setErrors(null) ;
              });

              // this.router.navigate(['/display']);
              if (data.status === true) {
                  this.spinnerService.hide();
                  // this.flashMessage.show(data.response, { cssClass: 'alert-success', timeout: 5000 });
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text:  data.message,
                    showConfirmButton: true,
                    timer: 5000
                  });

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
