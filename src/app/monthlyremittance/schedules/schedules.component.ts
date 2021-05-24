import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// import { truncate } from 'fs';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {
  dtOptions: any = {};
  modalOptions: NgbModalOptions;
  apiUrl: string;
  schedulesData: any;
  forwardScheduleForm: FormGroup;
  scheduleForm: FormGroup;
  assessmentForm: FormGroup;
  closeResult: string;
  submitted: boolean;
  scheduleEmployeesData: any;
  selectedSchedule: any;
  showGenerateAssessment: boolean = false;
  showForwardSchedule: boolean = false;
  managerRole: boolean = false;
  editorRole: boolean = false;
  forwardedTrue: boolean = false;
  assessmentStatusTrue: boolean = false;


  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private sess: SessionService,
              private modalService: NgbModal,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.checkLogin();
    this.initialiseForms();
    this.getSchedules();
    console.log('token: ', localStorage.getItem('access_token'));
    var userRole = localStorage.getItem('role_id');

    if (userRole == '5') {
      this.showGenerateAssessment = true;
      this.managerRole = true;
    }

    if (userRole == '6') {
      this.editorRole = true;
    }

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      // size: 'lg'
      size: 'xl',
    };

    this.intialiseTableProperties();
  }

  intialiseTableProperties() {
    this.dtOptions = {
      paging: true,
      scrollX: true,
      pagingType: 'full_numbers',
      responsive: true,
      pageLength: 10,
      lengthChange: true,
      processing: true,
      ordering: false,
      info: true,
      columnDefs: [
        {
          //targets: [10],
          visible: false,
          searchable: false
        }
      ],
      dom: '<\'row\'<\'col-sm-4\'l><\'col-sm-4 text-center\'B><\'col-sm-4\'f>>' + '<\'row\'<\'col-sm-12\'tr>>' + '<\'row\'<\'col-sm-5\'i><\'col-sm-7\'p>>',
      buttons: [
        // { extend: 'copy',  className: 'btn btn-outline-dark', text: '<i class="far fa-copy"> Copy</i>' },
        // tslint:disable-next-line: max-line-length
        { extend: 'csv', className: 'btn btn-outline-dark export-btn', text: '<i class="fas fa-file-csv"> CSV</i>', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } },
        // tslint:disable-next-line: max-line-length
        { extend: 'excel', className: 'btn btn-outline-dark export-btn', text: '<i class="fas fa-file-excel"> Excel</i>', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } },
        // tslint:disable-next-line: max-line-length
        { extend: 'pdf', className: 'btn btn-outline-dark export-btn', text: '<i class="fas fa-file-pdf"> PDF</i>', orientation: 'landscape', pageSize: 'LEGAL', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } },
        // tslint:disable-next-line: max-line-length
        { extend: 'print', className: 'btn btn-outline-dark export-btn', text: '<i class="far fas fa-print"> Print</i>', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } }
      ]
    };

  }

  initialiseForms() {
    this.forwardScheduleForm = this.formBuilder.group({
      scheduleYear: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(4), Validators.maxLength(4)]],
      scheduleMonthId: ['', Validators.required],
      comment: ['', Validators.required],
    });

    this.assessmentForm = this.formBuilder.group({
      assessmentYear: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(4), Validators.maxLength(4)]],
      assessmentMonthId: ['', Validators.required],
    });

    this.scheduleForm = this.formBuilder.group({
      forwardedTo: [''],
      assessmentStatus: [''],
      dateForwarded: [''],
      status: [''],
      dueDate: [''],
      corporateId: [''],
      createdAt: [''],
    });
  }

  viewSchedule(modal, selectedSchedule) {
    console.log('selectedSchedule: ', selectedSchedule);
    this.showModal(modal);

    this.getSingleSchedule(selectedSchedule.id);
    var array = selectedSchedule.due_date.split('-', 3);
    var dueDateYear = array[0];
    var dueDateMonth = array[1];

    this.assessmentForm = this.formBuilder.group({
      assessmentYear: [dueDateYear],
      assessmentMonthId: [dueDateMonth],
    });

    this.forwardScheduleForm = this.formBuilder.group({
      scheduleYear: [dueDateYear],
      scheduleMonthId: [dueDateMonth],
      comment: ['', Validators.required],
    });

  }

  loadSelectedScheduleData(selectedSchedule) {
    let status = selectedSchedule.status == 0 ? 'In Active' : 'Active';
    let assessmentStatus = selectedSchedule.assessment_status == 0 ? 'Still Open' : 'Case Closed';
    let forwardedTo = selectedSchedule.forwarded_to == 0 ? 'Not forwarded' : selectedSchedule.forwarded_to == 1 ? 'Forwarded to Editor' : 'Forwarded to Manager';

    this.scheduleForm = this.formBuilder.group({
      forwardedTo: [forwardedTo],
      assessmentStatus: [assessmentStatus],
      dateForwarded: [selectedSchedule.date_forwarded],
      status: [status],
      dueDate: [selectedSchedule.due_date],
      corporateId: [selectedSchedule.corporate_id],
      createdAt: [selectedSchedule.created_at],
    });

    if(forwardedTo === 'Forwarded to Manager'){
      this.forwardedTrue = true;
    }
    if(assessmentStatus === 'Case Closed'){
      this.assessmentStatusTrue = true;
    }

    this.scheduleEmployeesData = selectedSchedule.schedule_records;
  }

  getSchedules() {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'schedules-list';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    let corporateId = localStorage.getItem('corporate_id');

    const obj = {
      corporate_ids: [corporateId],
    };

    this.httpClient.post<any>(this.apiUrl, obj, { headers: reqHeader }).subscribe(data => {
      console.log('schedulesData: ', data);
      this.schedulesData = data.response == null ? [] : data.response.data;
      this.spinnerService.hide();
    });
  }

  getSingleSchedule(scheduleId) {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'schedules/' + scheduleId;

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('singleScheduleData: ', data);
      this.selectedSchedule = data.response.data;
      this.loadSelectedScheduleData(this.selectedSchedule);
      this.spinnerService.hide();
    });
  }

  forwardSchedule(modal) {
    this.showModal(modal);
  }

  showModal(modal) {
    this.modalService.open(modal, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSubmitSchedule(formAllData: any) {
    this.submitted = true;

    // stop the process here if form is invalid
    if (this.forwardScheduleForm.invalid) {
      return;
    }

    let corporateId = localStorage.getItem('corporate_id');

    const obj = {
      comment: formAllData.comment,
      due_date: formAllData.scheduleYear + '-' + formAllData.scheduleMonthId,
      corporate_ids: [corporateId],
    };

    console.log('scheduleFormData: ', obj);
    this.postForwardSchedule(obj);
  }

  postForwardSchedule(jsonData: any) {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'schedules/forward';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.post<any>(this.apiUrl, jsonData, { headers: reqHeader }).subscribe(data => {
      console.log('scheduleApiResponseData: ', data);

      if (data.status === true) {
        // Rest form fithout errors
        this.forwardScheduleForm.reset();
        Object.keys(this.forwardScheduleForm.controls).forEach(key => {
          this.forwardScheduleForm.get(key).setErrors(null);
        });

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.response != null && data.response[0] != undefined ? data.response[0].message : data.message,
          showConfirmButton: true,
          timer: 5000
        });

        this.spinnerService.hide();
        this.modalService.dismissAll();

      } else {
        this.spinnerService.hide();

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.response != null && data.response[0] != undefined ? data.response[0].message : data.message,
          showConfirmButton: true,
          timer: 5000
        });
      }
    });
  }

  generateAssessment(modal) {
    this.showModal(modal);
  }

  onSubmitAssessment(formAllData) {
    this.submitted = true;

    // stop the process here if form is invalid
    if (this.assessmentForm.invalid) {
      return;
    }

    let corporateId = localStorage.getItem('corporate_id');

    const obj = {
      due_date: formAllData.assessmentYear + '-' + formAllData.assessmentMonthId,
      corporate_id: corporateId,
    };

    console.log('assessmentFormData: ', obj);
    this.postGenerateAssessment(obj);
  }

  postGenerateAssessment(jsonData: any) {
    this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'assessments';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.post<any>(this.apiUrl, jsonData, { headers: reqHeader }).subscribe(data => {
      console.log('assessmentApiResponseData: ', data);

      if (data.status === true) {
        // Rest form fithout errors
        this.assessmentForm.reset();
        Object.keys(this.assessmentForm.controls).forEach(key => {
          this.assessmentForm.get(key).setErrors(null);
        });

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.response != null && data.response[0] != undefined ? data.response[0].message : data.message,
          showConfirmButton: true,
          timer: 5000
        });

        this.getSchedules();
        this.spinnerService.hide();
        this.modalService.dismissAll();

      } else {
        this.spinnerService.hide();

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.response != null && data.response[0] != undefined ? data.response[0].message : data.message,
          showConfirmButton: true,
          timer: 5000
        });
      }
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
