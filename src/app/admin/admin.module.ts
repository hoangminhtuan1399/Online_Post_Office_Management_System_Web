import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from "@angular/forms";
import { PaymentsComponent } from './components/payments/payments.component';
import { BranchesComponent } from './components/branches/branches.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ServicesComponent } from './components/services/services.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminRoutingModule } from "./admin-routing.module";
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';



@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    PaymentsComponent,
    BranchesComponent,
    EmployeesComponent,
    ServicesComponent,
    ProfileComponent,
    SidebarComponent,
    AdminLayoutComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
