import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 

import { AdminRoutingModule } from './admin-routing.module';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { BranchesComponent } from './components/branches/branches.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { EmployeeListComponent } from './components/employees/employee-list/employee-list.component'; 
import { EmployeeCreateComponent } from './components/employees/employee-create/employee-create.component';
import { OfficeListComponent } from './components/offices/office-list/office-list.component';
import { PackageComponent } from './components/package/package.component';
import { EmployeeEditComponent } from './components/employees/employee-edit/employee-edit.component';
import { EmployeeDetailComponent } from './components/employees/employee-detail/employee-detail.component';
import { ServiceEditComponent } from './components/services/service-edit/service-edit.component';
import { ServiceDetailComponent } from './components/services/service-detail/service-detail.component';
import { ServiceListComponent } from './components/services/service-list/service-list.component';
import { ServiceCreateComponent } from './components/services/service-create/service-create.component';
import { ProfileUpdateComponent } from './components/profile-update/profile-update.component';
@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    PaymentsComponent,
    BranchesComponent,
    ProfileComponent,
    SidebarComponent,
    AdminLayoutComponent,
    EmployeeListComponent,
    EmployeeCreateComponent,
    OfficeListComponent,
    PackageComponent,
    EmployeeEditComponent,
    EmployeeDetailComponent,
    ServiceEditComponent,
    ServiceDetailComponent,
    ServiceListComponent,
    ServiceCreateComponent,
    ProfileUpdateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,  
    AdminRoutingModule
  ]
})
export class AdminModule { }
