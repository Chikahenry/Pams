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
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss'],
})
export class MyprofileComponent implements OnInit {
  userProfileForm: FormGroup;
  submitted = false;
  apiUrl: any;
  userID: any;
  corporateID: any;
  apidata: any;
  roles: any;
  myroles: any;
  roleID: any;
  employeesCount: number;
  applications: any;
  myapplications: any;
  files: any;
  file: any;
  imageSrc: string;
  profileImage: string;
  filePath: any;
  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private httpClient: HttpClient,
    private sess: SessionService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {}

  ngOnInit(): void {
    // Check User Login
    this.sess.checkLogin();

    this.roleID = localStorage.getItem('role_id');
    //  if (this.roleID != 1) {
    //   this.router.navigate(['/logout']);
    //  }

    this.userID = localStorage.getItem('id');
    this.corporateID = localStorage.getItem('corporate_id');
    this.getApplication();
    this.getUserData();

    this.userProfileForm = this.formBuilder.group({
      name: ['', [Validators.maxLength(45), Validators.pattern('[a-zA-Z ]*')]],
      phone: [
        '',
        [
          Validators.required, Validators.pattern(/^[0-9\s]*$/),
          Validators.minLength(10),
          Validators.maxLength(14),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      myfile: ['']
    });
  }

  getRole() {
    this.apiUrl = environment.AUTHAPIURL + 'roles';
    return this.httpClient.get<any>(this.apiUrl).subscribe((res) => {
      console.log(res.response);
      this.roles = res.response;

      const arr = [];
      for (const obj of this.roles) {
        // console.log(obj);
        arr.push({
          id: obj.id,
          role_name: obj.role_name,
          status: obj.status,
        });
        this.myroles = arr;
      }
    });
  }

  getApplication() {
    this.apiUrl = environment.AUTHAPIURL + 'applications/1/roles';
    return this.httpClient.get<any>(this.apiUrl).subscribe((res) => {
      console.log(res.response);
      this.applications = res.response;
      this.roles = res.response;

      const arr = [];
      for (const obj of this.applications) {
        // console.log(obj);
        arr.push({
          id: obj.id,
          application_name: obj.application_name,
          status: obj.status,
        });
        this.myapplications = arr;
      }
    });
  }

  getUserData() {
    this.apiUrl = environment.AUTHAPIURL + 'users/' + this.userID;

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    });

    this.spinnerService.show();
    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        console.log(data);
        this.apidata = data.response;
        this.profileImage = data.response.profile_image;
        this.spinnerService.hide();
      });
  }

  onUpdate(formAllData: any) {
    this.submitted = true;
    // stop the process here if form is invalid
    if (this.userProfileForm.invalid) {
      return;
    }
    console.log(formAllData);
    if(formAllData.myfile === ''){
      const user = {
        name: formAllData.name,
        phone: formAllData.phone,
        id: this.userID,
      };

      this.postData(user);
    } else {

    this.apiUrl = environment.AUTHAPIURL + 'file/upload';

    const formData = new FormData();
    formData.append('file', this.userProfileForm.get('myfile').value);

    const config = {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }
    };

    this.spinnerService.show();
    this.httpClient
      .post<any>(this.apiUrl, formData, config)
      .subscribe((data) => {
        console.log(data);

        if (data.status === true) {
          Object.keys(this.userProfileForm.controls).forEach((key) => {
            this.userProfileForm.get(key).setErrors(null);
          });

          const user = {
            profile_image: data.response.url,
            name: formAllData.name,
            phone: formAllData.phone,
            id: this.userID,
          };
          this.imageSrc = user.profile_image;
          console.log('Image Url = ' + this.imageSrc);
          this.postData(user);
        } else {
          this.spinnerService.hide();

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please attach only JPEG and PNG Files',
            showConfirmButton: true,
            timer: 5000,
          });
        }
      });
    }
  }

  postData(jsonData: any) {
    this.apiUrl = environment.AUTHAPIURL + 'users/update';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    });

    this.spinnerService.show();

    this.httpClient
      .post<any>(this.apiUrl, jsonData, { headers: reqHeader })
      .subscribe((data) => {
        console.log(data);

        if (data.status === true) {
          Object.keys(this.userProfileForm.controls).forEach((key) => {
            this.userProfileForm.get(key).setErrors(null);
          });

          this.getUserData();
          this.spinnerService.hide();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text:
              'Your Profile has been updated successfully',
            showConfirmButton: true,
            timer: 5000,
          });
        } else {
          this.spinnerService.hide();

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text:
              data.response != null && data.response[0] != undefined
                ? data.response[0].message
                : data.message,
            showConfirmButton: true,
            timer: 5000,
          });
        }
      });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file = event.target.files[0];
      this.filePath = event.target.files[0].name;
      this.userProfileForm.get('myfile').setValue(file);
    }
  }
}
