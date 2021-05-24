import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deletedemployees',
  templateUrl: './deletedemployees.component.html',
  styleUrls: ['./deletedemployees.component.scss']
})
export class DeletedemployeesComponent implements OnInit {
  apiUrl: string;
  apidata: any;
  dtOptions: any = {};
  roleID: any;
  managerRole: boolean = false;
  userID: any;
  corporateId: any;
  // tslint:disable-next-line: max-line-length
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private sess: SessionService,
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
    if(this.roleID === '5'){
      this.managerRole = true;
    }
    this.corporateId = localStorage.getItem('corporate_id');
    this.getDeletedEmployees();
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
          className: 'btn btn-outline-dark',
          text: '<i class="fas fa-file-csv"> CSV</i>',
        },
        {
          extend: 'excel',
          className: 'btn btn-outline-dark',
          text: '<i class="fas fa-file-excel"> Excel</i>',
        },
        // tslint:disable-next-line: max-line-length
        {
          extend: 'pdf',
          className: 'btn btn-outline-dark',
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: 'landscape',
          pageSize: 'LEGAL',
        },
        // { extend: 'print', className: 'btn btn-outline-dark', text: '<i class="far fas fa-print"> Print</i>' }
      ],
    };
  }

  getDeletedEmployees() {
    this.apiUrl = environment.AUTHAPIURL + 'employees-deleted';
    const obj = {
      corporate_id: this.corporateId
    };
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    });

    this.spinnerService.show();
    this.httpClient
    .post<any>(this.apiUrl, obj, { headers: reqHeader })
    .subscribe((data) => {
      console.log(data);
      this.apidata = data.response;
      this.spinnerService.hide();
      });
  }

}
