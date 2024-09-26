import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { OfficeService } from '../../offices/office.service';
import { Employee } from '../../../models/employee.model';
import { Office } from '../../../models/office.model';
import { Account } from '../../../models/account.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent implements OnInit {
  employee: Employee = {
    id: '',
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: new Date(),
    officeId: '',
    accountId: '',
    officeName:'',
    createdDate: '' 
  };

  account: Account = {
    id: '',
    username: '',
    password: '',
    roleId: ''
  };

  offices: Office[] = [];
  showPassword: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private officeService: OfficeService
  ) { }

  ngOnInit(): void {
    this.loadOffices();
  }

  loadOffices(): void {
    this.officeService.getAllOffices().subscribe({
      next: (offices) => {
        this.offices = offices;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load offices. Please try again.';
        console.error('Error fetching offices', error);
      }
    });
  }

  createEmployeeAndAccount(): void {           
    this.employee.createdDate = new Date().toISOString();
    this.employeeService.createEmployeeWithAccount(this.employee, this.account).subscribe({
      next: () => {
        this.successMessage = 'Employee and Account created successfully!';
        this.errorMessage = null;
        this.resetForm();
      },
      error: (error) => {
        this.errorMessage = 'Failed to create employee and account. Please try again.';
        this.successMessage = null;
        console.error('Error creating employee and account', error);
      }
    });
  }

  private resetForm(): void {
    this.employee = {
      id: '',
      name: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: new Date(),
      officeId: '',
      accountId: '',
      officeName:'',
      createdDate: '' 
    };

    this.account = {
      id: '',
      username: '',
      password: '',
      roleId: ''
    };

    this.showPassword = false; 
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
