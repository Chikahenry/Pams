import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './__inc/header/header.component';
import { SidebarComponent } from './__inc/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './__inc/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './users/edit/edit.component'; 
import { LoginComponent } from './auth/login/login.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { SessionService } from './session.service';
import { LogoutComponent } from './auth/logout/logout.component';
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service for session
import { RecaptchaModule } from 'ng-recaptcha';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import { AdduserComponent } from './users/adduser/adduser.component';
import { DisplayuserComponent } from './displayuser/displayuser.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { ChangepasswordComponent } from './auth/changepassword/changepassword.component'; 
import { FaqComponent } from './faq/faq.component'; 

import {MatNativeDateModule } from '@angular/material/core';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SatNativeDateModule, SatDatepickerModule} from 'saturn-datepicker';
import { UseractivitiesComponent } from './auth/useractivities/useractivities.component';
import { NotificationComponent } from './notification/notification.component';
import { ForgotpasswordComponent } from './auth/forgotpassword/forgotpassword.component';
import { VerifyotpComponent } from './auth/verifyotp/verifyotp.component';
import { ResetpasswordComponent } from './auth/resetpassword/resetpassword.component';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter'; 
import { SignupComponent } from './auth/signup/signup.component'; 
import { MyprofileComponent } from './profile/myprofile/myprofile.component';
import { CompanyprofileComponent } from './profile/companyprofile/companyprofile.component'; 
import { DeletedemployeesComponent } from './profile/deletedemployees/deletedemployees.component';
import { PaymenthistoryComponent } from './paymenthistory/paymenthistory.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HomeComponent } from './home/home.component';
import { NgxPrintModule} from 'ngx-print';
import { SampleTemplateComponent } from './sampling/sampleTemplate/sampleTemplate.component';
import { ForwardedSamplingComponent } from './sampling/forwardedSampling/forwardedSampling.component';
import { ClientsComponent } from './client/clients/clients.component';
// import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  declarations: [		
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    FooterComponent,
    EditComponent, 
    DeletedemployeesComponent,
    LoginComponent,
    SignupComponent, 
    PagenotfoundComponent,
    LogoutComponent,
    AdduserComponent,
    UseractivitiesComponent,
    DisplayuserComponent,
    ChangepasswordComponent, 
    SampleTemplateComponent, 
    ForwardedSamplingComponent, 
    CompanyprofileComponent, 
    FaqComponent,
    MyprofileComponent, 
    NotificationComponent,
    ForgotpasswordComponent,
    ClientsComponent,
    VerifyotpComponent,
    ResetpasswordComponent, 
      PaymenthistoryComponent,
      ContactusComponent,
      HomeComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RecaptchaModule,
    FlashMessagesModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    NgbModule,
    DataTablesModule,
    SweetAlert2Module.forRoot(),
  
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SatNativeDateModule,
    SatDatepickerModule,
    MatMomentDateModule,
    NgxPrintModule

  ],
  // tslint:disable-next-line: max-line-length
  providers: [  SessionService, BnNgIdleService,
               {provide : LocationStrategy , useClass: HashLocationStrategy},
               { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }}
              ],



  bootstrap: [AppComponent]
})
export class AppModule { }