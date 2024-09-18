import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/components/home/home.component";
import { DashboardComponent } from "./admin/components/dashboard/dashboard.component";
import { AuthGuard } from "./admin/auth.guard";
import { LoginComponent } from "./admin/components/login/login.component";
import { PaymentsComponent } from "./admin/components/payments/payments.component";
import { BranchesComponent } from "./admin/components/branches/branches.component";
import { ServicesComponent } from "./admin/components/services/services.component";
import { ProfileComponent } from "./admin/components/profile/profile.component";
import { AdminLayoutComponent } from "./admin/components/admin-layout/admin-layout.component";
import { EmployeeListComponent } from './admin/components/employees/employee-list/employee-list.component';
import { EmployeeCreateComponent } from './admin/components/employees/employee-create/employee-create.component';
import { EmployeeEditComponent } from './admin/components/employees/employee-edit/employee-edit.component';  // Import EmployeeEditComponent
import { EmployeeDetailComponent } from './admin/components/employees/employee-detail/employee-detail.component'; // Import EmployeeDetailComponent

const routes: Routes = [
  { path: 'admin/login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'branches', component: BranchesComponent },
      { path: 'employees/list', component: EmployeeListComponent },
      { path: 'employees/create', component: EmployeeCreateComponent },
      { path: 'employees/edit/:id', component: EmployeeEditComponent },  
      { path: 'employees/detail/:id', component: EmployeeDetailComponent }, 
      { path: 'services', component: ServicesComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard' }
    ]
  },
  { path: '', component: HomeComponent },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
