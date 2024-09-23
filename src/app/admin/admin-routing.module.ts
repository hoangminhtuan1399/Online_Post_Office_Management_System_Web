import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { BranchesComponent } from './components/branches/branches.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { EmployeeListComponent } from './components/employees/employee-list/employee-list.component';  
import { EmployeeCreateComponent } from './components/employees/employee-create/employee-create.component';
import { EmployeeEditComponent } from './components/employees/employee-edit/employee-edit.component';
import { EmployeeDetailComponent } from './components/employees/employee-detail/employee-detail.component';

// Import thêm các component của Service
import { ServiceListComponent } from './components/services/service-list/service-list.component';
import { ServiceCreateComponent } from './components/services/service-create/service-create.component';
import { ServiceEditComponent } from './components/services/service-edit/service-edit.component';
import { ServiceDetailComponent } from './components/services/service-detail/service-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'branches', component: BranchesComponent },
      { path: 'services', component: ServiceListComponent }, 
      { path: 'services/create', component: ServiceCreateComponent },
      { path: 'services/edit/:id', component: ServiceEditComponent }, 
      { path: 'services/detail/:id', component: ServiceDetailComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'employees', component: EmployeeListComponent }, 
      { path: 'employees/create', component: EmployeeCreateComponent },
      { path: 'employees/edit/:id', component: EmployeeEditComponent }, 
      { path: 'employees/detail/:id', component: EmployeeDetailComponent }, 
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
