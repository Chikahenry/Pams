import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { environment } from 'src/environments/environment';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-paymenthistory',
  templateUrl: './paymenthistory.component.html',
  styleUrls: ['./paymenthistory.component.scss']
})
export class PaymenthistoryComponent implements OnInit {


  dtOptions: any = {};
  roleID: any;
  submitted: boolean;
  apidata: any;
  singleCorporate = [] as any;
  apiUrl: string;
  corporateId = localStorage.getItem('corporate_id');
  selectedPayment: any;
  modalOptions: NgbModalOptions;
  closeResult: string;
  paymentData: any;
  companyName: any;

  // tslint:disable-next-line: max-line-length
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private sess: SessionService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {}


  ngOnInit() {
    this.sess.checkLogin();

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'md',
    };
    this.roleID = localStorage.getItem('role_id');
    if (this.roleID != 5 && this.roleID != 6 && this.roleID != 7) {
      this.router.navigate(['/dashboard']);
     }

    this.getCompanyData();
    this.getPaymentHistory();
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
          className: 'btn btn-outline-dark export-btn',
          text: '<i class="fas fa-file-csv"> CSV</i>',
        },
        {
          extend: 'excel',
          className: 'btn btn-outline-dark export-btn',
          text: '<i class="fas fa-file-excel"> Excel</i>',
        },
        // tslint:disable-next-line: max-line-length
        {
          extend: 'pdf',
          className: 'btn btn-outline-dark export-btn',
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: 'landscape',
          pageSize: 'LEGAL',
        },
        // { extend: 'print', className: 'btn btn-outline-dark', text: '<i class="far fas fa-print"> Print</i>' }
      ],
    };
  }

  getPaymentHistory() {
    this.apiUrl = environment.AUTHAPIURL + 'payment/history';
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
        this.spinnerService.hide();
        this.apidata = data.response.data;

      });
  }
  
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return  `with: ${reason}`;
      }
    }
  
    showModal(modal) {
      this.modalService.open(modal, this.modalOptions).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

  viewPayment(modal, selectedPayment) {
    console.log('selectedPayment: ', selectedPayment);
    this.showModal(modal);
    const select = {
      id: selectedPayment.id,
      corporate_id: this.corporateId
    };
    this.getSinglePayment(select);

  }

  getSinglePayment(payment: any) {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'payment/single';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.post<any>(this.apiUrl, payment, { headers: reqHeader }).subscribe(data => {
      console.log('singlePaymentData: ', data);
      this.paymentData = data.response;
      console.log(this.paymentData);
      this.selectedPayment = data.response;
      this.spinnerService.hide();
    });
  }

  getCompanyData() {
    this.spinnerService.show();

    this.apiUrl = environment.AUTHAPIURL + 'corporates/' + this.corporateId;

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    });

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.companyName = data.response.company_name;
        this.spinnerService.hide();
      });

  }

}
