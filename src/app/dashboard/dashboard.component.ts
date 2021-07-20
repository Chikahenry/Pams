import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../session.service';
import { environment } from '../../environments/environment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  apiUrl: string;
  apidata: any;
  total: any;
  x: any;
  isRun: any;
  nigeria: any;
  all: any;
  totalActive: any = 0;
  totalInctive: any = 0;
  employeesCount: any;
  clientsData: any;
  usersData: any;
  sampleTemplateData: any;


  // tslint:disable-next-line: max-line-length
  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private router: Router, private sess: SessionService, private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.checkLogin();
    this.getclients()
    this.getSampleTemplates()
    this.getUserData()
    // this.getDashboardData();  

    this.isRun = localStorage.getItem('is_reload');
    // alert(this.isRun);
    // if(this.isRun != 'true') {
    //     this.refresh();
    // }
  }

  logout() {
    this.sess.logOut();
  }

  refresh() {
    localStorage.setItem('is_reload', 'true');
    window.location.reload();
  }

  getDashboardData() {
    // this.apiUrl = environment.AUTHAPIURL + 'dashboard';

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
      this.spinnerService.hide();
      });
  }
 

  getclients() {
    // this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'client/getallclient';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('clientsData: ', data);
      this.spinnerService.hide();
      this.clientsData = data.returnObject == null ? [] : data.returnObject;

    });
  }
 
  getUserData() {
    this.apiUrl = environment.AUTHAPIURL + 'management/getusers';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    });

    // this.spinnerService.show(); 

    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log(data);
      this.usersData = data.returnObject;
      this.spinnerService.hide();
      });
  }

  getSampleTemplates() { 
    this.apiUrl = environment.AUTHAPIURL + 'sample/sampleTemplates';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('clientsData: ', data);
      this.sampleTemplateData = data.returnObject == null ? [] : data.returnObject;
       
    });
  }
  
}
