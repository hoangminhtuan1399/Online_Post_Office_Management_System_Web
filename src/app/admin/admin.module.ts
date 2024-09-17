import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 

import { AdminRoutingModule } from './admin-routing.module';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { BranchesComponent } from './components/branches/branches.component';
import { ServicesComponent } from './components/services/services.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { EmployeeListComponent } from './components/employees/employee-list/employee-list.component'; 
import { EmployeeCreateComponent } from './components/employees/employee-create/employee-create.component';
import { OfficeListComponent } from './components/offices/office-list/office-list.component';
import { PackageComponent } from './components/package/package.component';


@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    PaymentsComponent,
    BranchesComponent,
    ServicesComponent,
    ProfileComponent,
    SidebarComponent,
    AdminLayoutComponent,
    EmployeeListComponent,
    EmployeeCreateComponent,
    OfficeListComponent
    PackageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,  
    AdminRoutingModule
  ]
})
export class AdminModule { }
