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


  // tslint:disable-next-line: max-line-length
  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private router: Router, private sess: SessionService, private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.checkLogin();

    this.spinnerService.show(); // show the spinner
    this.getDashboardData();
    this.getEmployees();
    //this.getAll();
    this.spinnerService.hide(); // hide the spinner if success

    this.isRun = localStorage.getItem('is_reload');
    // alert(this.isRun);
    if(this.isRun != 'true') {
        this.refresh();
    }
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

  getEmployees() {
    // this.apiUrl = environment.AUTHAPIURL + 'employees-list';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    let corporateId = localStorage.getItem('corporate_id');

    const obj = {
      corporate_ids: [corporateId],
    };

    this.httpClient.post<any>(this.apiUrl, obj, { headers: reqHeader }).subscribe(data => {
      console.log('employeesData: ', data);
      this.employeesCount = data.response.data.length;

    });
  }
 

}
