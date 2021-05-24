import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  roleID: any;
  apiUrl: any;
  apidata: any;
  apicompanydata: any;
  userID: any;
  roleName: any
  corporateLogo: string;
  corporateID = localStorage.getItem('corporate_id');
  fullname: string;

  constructor(
    private httpClient: HttpClient,
    private sess: SessionService,
    private route: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService
  ) { this.userID = localStorage.getItem('id'); }

  ngOnInit(): void {
    this.sess.checkLogin();
    // this.getUserData(); 
    this.roleID = localStorage.getItem('role_id');
    this.fullname = localStorage.getItem('fullname')

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
        console.log('userApiData: ', this.apidata);
        this.spinnerService.hide();
      });
  }

  getCompanyData() {

    this.apiUrl = environment.AUTHAPIURL + 'corporates/' + this.corporateID;

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    });
    this.spinnerService.show();

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        console.log(data);
        this.apicompanydata = data.response;
        this.corporateLogo = data.response.corporate_logo;
        this.spinnerService.hide();
    });

  }

}
