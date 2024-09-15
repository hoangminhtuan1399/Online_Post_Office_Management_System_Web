import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeCreateComponent } from './components/employee-create/employee-create.component';

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeCreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule, 
    RouterModule
  ],
  exports: [
    EmployeeListComponent,
    EmployeeCreateComponent
  ]
})
export class EmployeeModule { }
