import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipmentinventory',
  templateUrl: './equipmentinventory.component.html',
  styleUrls: ['./equipmentinventory.component.scss']
})
export class EquipmentinventoryComponent implements OnInit {
  apiUrl: string;
  inventoryData: any;
  dtOptions: any = {};
  modalOptions: NgbModalOptions;
  closeResult: string; 
  inventoryForm: FormGroup; 
  submitted: boolean = false; 
  equipmentId: any;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private sess: SessionService,
              private modalService: NgbModal,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.checkLogin(); 
    this.getEquipmentInventory();  
    this.initialiseForms()
    this.intialiseTableProperties();
    // console.log('token: ', localStorage.getItem('access_token'));

  }
  initialiseForms() {
    this.inventoryForm = this.formBuilder.group({
      equipmentName: ['', Validators.required],
      description: ['', Validators.required],
      idTag: ['', Validators.required], 
      supplier: ['', Validators.required], 
      quantity: ['', Validators.required], 
      location: ['', Validators.required], 
      price: ['', Validators.required], 
      condition: ['', Validators.required], 
      unitPrice: ['', Validators.required], 
      purchaseDate: ['', Validators.required], 
      warrantyExpiration: ['', Validators.required], 
      modelNumber: ['', Validators.required], 
      photoLink: ['', Validators.required], 
      serialNumber: ['', Validators.required], 
      discontinued: ['', Validators.required], 
    }); 
  }

  initialiseUpdateForms(equipment) {
    let purchaseDate = equipment.purchaseDate.split("/").reverse().join("/")
    let warrantyExpiration = equipment.warrantyExpiration.split("/").reverse().join("/")
    this.inventoryForm = this.formBuilder.group({
      equipmentName: [equipment.equipmentName, Validators.required],
      description: [equipment.description, Validators.required],
      idTag: [equipment.idTag, Validators.required], 
      supplier: [equipment.supplier, Validators.required], 
      quantity: [equipment.quantity, Validators.required], 
      location: [equipment.location, Validators.required], 
      price: [equipment.price, Validators.required], 
      condition: [equipment.condition, Validators.required], 
      unitPrice: [equipment.unitPrice, Validators.required], 
      purchaseDate: [purchaseDate, Validators.required], 
      warrantyExpiration: [warrantyExpiration, Validators.required], 
      modelNumber: [equipment.modelNumber, Validators.required], 
      photoLink: [equipment.photoLink, Validators.required], 
      serialNumber: [equipment.serialNumber, Validators.required], 
      discontinued: [equipment.discountinued, Validators.required], 
    }); 
  }

  intialiseTableProperties() {
    this.modalOptions = {
      backdrop: true,
      centered: true,
      backdropClass: "customBackdrop",
      // size: 'lg'
      size: "lg",
    };

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
            //targets: [ 10 ],
            visible: false,
            searchable: false
        }
    ],
      // dom: '<\'row\'<\'col-sm-4\'l><\'col-sm-4 text-center\'B><\'col-sm-4\'f>>' + '<\'row\'<\'col-sm-12\'tr>>' + '<\'row\'<\'col-sm-5\'i><\'col-sm-7\'p>>',
      // buttons: [
      //           // { extend: 'copy',  className: 'btn btn-outline-dark', text: '<i class="far fa-copy"> Copy</i>' },
      //           // tslint:disable-next-line: max-line-length
      //           { extend: 'csv',   className: 'btn btn-outline-dark export-btn', text: '<i class="fas fa-file-csv"> CSV</i>', exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}},
      //           // tslint:disable-next-line: max-line-length
      //           { extend: 'excel', className: 'btn btn-outline-dark export-btn', text: '<i class="fas fa-file-excel"> Excel</i>', exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} },
      //           // tslint:disable-next-line: max-line-length
      //           { extend: 'pdf',   className: 'btn btn-outline-dark export-btn', text: '<i class="fas fa-file-pdf"> PDF</i>' , orientation: 'landscape', pageSize: 'LEGAL', exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}},
      //           // tslint:disable-next-line: max-line-length
      //           { extend: 'print', className: 'btn btn-outline-dark export-btn', text: '<i class="far fas fa-print"> Print</i>', exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } }
      //         ]
    };
  } 

  getEquipmentInventory() {
    // this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'inventory/equipment/all';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('inventoryData: ', data);
      this.spinnerService.hide();
      if(data.returnObject == null){
        Swal.fire({
          icon: "error",
          title: "Oop...",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
      }else{
        this.inventoryData = data.returnObject == null ? [] : data.returnObject;
      }

    });
  }
 

  viewAddInventory(modal){
    this.initialiseForms() 
    this.showModal(modal)
  }

  viewEditInventory(modal, equipment){
    this.initialiseUpdateForms(equipment) 
    this.equipmentId = equipment.id
    this.showModal(modal)
  }

  deleteInventory(inventoryId){

     const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    });

    this.apiUrl = environment.AUTHAPIURL + "inventory/equipment/"+ inventoryId;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.spinnerService.show();
        this.httpClient
          .delete<any>(this.apiUrl,  { headers: reqHeader })
          .subscribe((data) => {
            if (data.status == true) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Equipment has been successfully deleted!",
                showConfirmButton: true,
                timer: 5000,
              });
              this.getEquipmentInventory();

              // this.reload();
              this.spinnerService.hide();
              this.modalService.dismissAll();
            } else {
              this.spinnerService.hide();

              Swal.fire({
                icon: "error",
                title: "",
                text: data.message,
                // text:  'An error ocurred while trying to delete Todo!',
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
      }
    });
  }

  onSubmitInventory(formAllData) {
   
    this.submitted  = true
    if(this.inventoryForm.invalid) {
      return
    } 
    const obj = {
      equipmentName: formAllData.equipmentName,
      description: formAllData.description,
      idTag: formAllData.idTag,
      location: formAllData.location,
      supplier: formAllData.supplier,
      purchaseDate: formAllData.purchaseDate,
      price: formAllData.price,
      condition: formAllData.condition,
      unitPrice: formAllData.unitPrice,
      quantity: formAllData.quantity,
      modelNumber: formAllData.modelNumber,
      photoLink: formAllData.photoLink,
      serialNumber: formAllData.serialNumber,
      discountinued: formAllData.discontinued,
      warrantyExpiration: formAllData.warrantyExpiration
    }

    this.postInventory(obj)
  }

  postInventory(jsonData){

    this.apiUrl = environment.AUTHAPIURL + 'inventory/equipment';


    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.post<any>(this.apiUrl, jsonData, { headers: reqHeader }).subscribe(data => {
      console.log('singleclientData: ', data);
      
      if(data.status == true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        this.getEquipmentInventory();
      }else {
        Swal.fire({
          icon: "error",
          title: "Oop...",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        
      }
 
      this.spinnerService.hide();
    });
  }

  onUpdateInventory(formAllData) {
   
    this.submitted  = true
    if(this.inventoryForm.invalid) {
      return
    } 
    const obj = {
      id: this.equipmentId,
      equipmentName: formAllData.equipmentName,
      description: formAllData.description,
      idTag: formAllData.idTag,
      location: formAllData.location,
      supplier: formAllData.supplier,
      purchaseDate: formAllData.purchaseDate,
      price: formAllData.price,
      condition: formAllData.condition,
      unitPrice: formAllData.unitPrice,
      quantity: formAllData.quantity,
      modelNumber: formAllData.modelNumber,
      photoLink: formAllData.photoLink,
      serialNumber: formAllData.serialNumber,
      discountinued: formAllData.discontinued,
      warrantyExpiration: formAllData.warrantyExpiration
    }

    this.putInventory(obj)
  }

  putInventory(jsonData){

    this.apiUrl = environment.AUTHAPIURL + 'inventory/equipment';


    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.post<any>(this.apiUrl, jsonData, { headers: reqHeader }).subscribe(data => {
      console.log('singleclientData: ', data);
      
      if(data.status == true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        this.getEquipmentInventory();
      }else if(data.status == 400){
        Swal.fire({
          icon: "error",
          title: "Oop...",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        
      }
 
      this.spinnerService.hide();
    });
  }
  
  showModal(modal) {
    this.modalService.open(modal, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

}
