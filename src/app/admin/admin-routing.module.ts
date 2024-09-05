import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { BranchesComponent } from './components/branches/branches.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ServicesComponent } from './components/services/services.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'branches', component: BranchesComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: 'dashboard' } // Redirect unknown routes to dashboard
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
