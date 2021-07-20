import { ForgotpasswordComponent } from './auth/forgotpassword/forgotpassword.component';
import { UseractivitiesComponent } from './auth/useractivities/useractivities.component';
import { FaqComponent } from './faq/faq.component';

import { LogoutComponent } from './auth/logout/logout.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LoginComponent } from './auth/login/login.component'; 
import { EditComponent } from './users/edit/edit.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdduserComponent } from './users/adduser/adduser.component';
import { DisplayuserComponent } from './displayuser/displayuser.component';
import { ChangepasswordComponent } from './auth/changepassword/changepassword.component'; 
import { NotificationComponent } from './notification/notification.component';
import { VerifyotpComponent } from './auth/verifyotp/verifyotp.component';
import { ResetpasswordComponent } from './auth/resetpassword/resetpassword.component'; 
import { SignupComponent } from './auth/signup/signup.component';  
import { PaymenthistoryComponent } from './paymenthistory/paymenthistory.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HomeComponent } from './home/home.component';
import { SampleTemplateComponent } from './sampling/sampleTemplate/sampleTemplate.component';
import { ForwardedSamplingComponent } from './sampling/forwardedSampling/forwardedSampling.component';
import { ClientsComponent } from './client/clients/clients.component';
import { FieldsamplingComponent } from './sampling/fieldsampling/fieldsampling.component';
import { LabtestComponent } from './sampling/labtest/labtest.component';
import { InvoicingComponent } from './invoicing/invoicing.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent,
  children: [
  
  ]
},
  {
    path: 'useractivities', component: UseractivitiesComponent,
  },
  {
    path: 'diplayuser', component: DisplayuserComponent,
  },
  {
    path: 'adduser', component: AdduserComponent,
  },
  {path: 'edit/:id', component: EditComponent}, 

  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'forgotpassword', component: ForgotpasswordComponent},
  {path: 'resetpassword', component: ResetpasswordComponent},
  {path: 'paymenthistory', component: PaymenthistoryComponent}, 
  {path: 'sampleTemplate', component: SampleTemplateComponent},
  {path: 'allSampling', component: ForwardedSamplingComponent},
  {path: 'client', component: ClientsComponent},
  {path: 'invoicing', component: InvoicingComponent},
   
  {path: 'displayuser', component: DisplayuserComponent}, 
  {path: 'fieldSampling', component: FieldsamplingComponent}, 
  {path: 'labTest', component: LabtestComponent}, 
  {path: 'reports', component: ReportComponent}, 
  {path: 'changepassword', component: ChangepasswordComponent}, 
  {path: 'faq', component: FaqComponent},
  {path: 'contactus', component: ContactusComponent}, 
  {path: 'notification', component: NotificationComponent},
  {path: 'verifyotp', component: VerifyotpComponent}, 
  {path: 'home', component: HomeComponent},

  {path: '**', component: PagenotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }