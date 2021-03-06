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
  selector: 'app-stockinventory',
  templateUrl: './stockinventory.component.html',
  styleUrls: ['./stockinventory.component.scss']
})
export class StockinventoryComponent implements OnInit {
  apiUrl: string;
  stockData: any;
  dtOptions: any = {};
  modalOptions: NgbModalOptions;
  closeResult: string; 
  inventoryForm: FormGroup; 
  submitted: boolean = false; 
  stockId: any;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private sess: SessionService,
              private modalService: NgbModal,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit(): void {
    this.sess.checkLogin(); 
    this.getStockInventory();  
    this.initialiseForms()
    this.intialiseTableProperties();
    // console.log('token: ', localStorage.getItem('access_token'));

  }
  initialiseForms() {
    this.inventoryForm = this.formBuilder.group({
      itemName: ['', Validators.required],
      itemNumber: ['', Validators.required],
      dateOfLastOrder: ['', Validators.required], 
      weight: ['', Validators.required], 
      quantity: ['', Validators.required], 
      location: ['', Validators.required], 
      totalValue: ['', Validators.required], 
      condition: ['', Validators.required], 
      expiryDate: ['', Validators.required], 
      unitCost: ['', Validators.required], 
      stockQty: ['', Validators.required], 
      reorderLevel: ['', Validators.required], 
      quantityUsed: ['', Validators.required], 
      quantityLeft: ['', Validators.required], 
      itemDiscontinued: ['', Validators.required], 
    }); 
  }

  initialiseUpdateForms(stock) {
    let dateOfLastOrder = stock.dateOfLastOrder.split("/").reverse().join("/")
    let expiryDate = stock.expiryDate.split("/").reverse().join("/")
    this.inventoryForm = this.formBuilder.group({
      itemName: [stock.itemName, Validators.required],
      itemNumber: [stock.itemNumber, Validators.required],
      dateOfLastOrder: [dateOfLastOrder, Validators.required], 
      weight: [stock.weight, Validators.required], 
      quantity: [stock.quantity, Validators.required], 
      location: [stock.location, Validators.required], 
      totalValue: [stock.totalValue, Validators.required], 
      condition: [stock.condition, Validators.required], 
      expiryDate: [expiryDate, Validators.required], 
      unitCost: [stock.unitCost, Validators.required], 
      stockQty: [stock.stockQty, Validators.required], 
      reorderLevel: [stock.reorderLevel, Validators.required], 
      quantityUsed: [stock.quantityUsed, Validators.required], 
      quantityLeft: [stock.quantityLeft, Validators.required], 
      itemDiscontinued: [stock.itemDiscontinued, Validators.required], 
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

  getStockInventory() {
    // this.spinnerService.show();
    this.apiUrl = environment.AUTHAPIURL + 'inventory/stock/all';

    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
  
    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe(data => {
      console.log('stockData: ', data);
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
        this.stockData = data.returnObject == null ? [] : data.returnObject;
      }

    });
  }
 

  viewAddInventory(modal){
    this.initialiseForms() 
    this.showModal(modal)
  }


  deleteInventory(inventoryId){

    const reqHeader = new HttpHeaders({
     "Content-Type": "application/json",
     Authorization: "Bearer " + localStorage.getItem("access_token"),
   });

   this.apiUrl = environment.AUTHAPIURL + "inventory/stock/"+ inventoryId;

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
               text: "Stock has been successfully deleted!",
               showConfirmButton: true,
               timer: 5000,
             });
             this.getStockInventory();

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
      itemName: formAllData.itemName,
      itemNumber: formAllData.itemNumber,
      dateOfLastOrder: formAllData.dateOfLastOrder,
      location: formAllData.location,
      weight: formAllData.weight,
      unitCost: formAllData.unitCost,
      totalValue: formAllData.totalValue,
      condition: formAllData.condition,
      expiryDate: formAllData.expiryDate,
      quantity: formAllData.quantity,
      reorderLevel: formAllData.reorderLevel,
      quantityUsed: formAllData.quantityUsed,
      quantityLeft: formAllData.quantityLeft,
      itemDiscontinued: formAllData.itemDiscontinued,
      stockQty: formAllData.stockQty
    }

    this.postInventory(obj)
  }

  postInventory(jsonData){

    this.apiUrl = environment.AUTHAPIURL + 'inventory/stock';


    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.post<any>(this.apiUrl, jsonData, { headers: reqHeader }).subscribe(data => {
      console.log('stockresponse: ', data);
      
      if(data.status == true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        this.getStockInventory();
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

  viewEditInventory(modal, stock){
    this.initialiseUpdateForms(stock) 
    this.stockId = stock.id
    this.showModal(modal)
  }
  
  onUpdateInventory(formAllData) {
   
    this.submitted  = true
    if(this.inventoryForm.invalid) {
      return
    } 
    const obj = {
      id: this.stockId,
      itemName: formAllData.itemName,
      itemNumber: formAllData.itemNumber,
      dateOfLastOrder: formAllData.dateOfLastOrder,
      location: formAllData.location,
      weight: formAllData.weight,
      unitCost: formAllData.unitCost,
      totalValue: formAllData.totalValue,
      condition: formAllData.condition,
      expiryDate: formAllData.expiryDate,
      quantity: formAllData.quantity,
      reorderLevel: formAllData.reorderLevel,
      quantityUsed: formAllData.quantityUsed,
      quantityLeft: formAllData.quantityLeft,
      itemDiscontinued: formAllData.itemDiscontinued,
      stockQty: formAllData.stockQty
    }

    this.putInventory(obj)
  }

  putInventory(jsonData){

    this.apiUrl = environment.AUTHAPIURL + 'inventory/stock';


    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    this.httpClient.put<any>(this.apiUrl, jsonData, { headers: reqHeader }).subscribe(data => {
      console.log('singleclientData: ', data);
      
      if(data.status == true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        this.getStockInventory();
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
