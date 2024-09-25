import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../employees/employee.service';
import { Employee } from '../../../models/employee.model';
import { Office } from '../../../models/office.model';
import { OfficeService } from '../../offices/office.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {
  @Input() employeeId: string | null = null;
  employee: Employee = {
    id: '',
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: new Date(),
    createdDate: '', 
    officeId: '',
    accountId: '',
    officeName: ''
  };
  offices: Office[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private officeService: OfficeService
  ) {}

  ngOnInit(): void {
    if (this.employeeId) {
      this.loadEmployeeDetails(this.employeeId);
    }
    this.loadOffices();
  }

  private loadEmployeeDetails(id: string): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employee = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          dateOfBirth: new Date(data.dateOfBirth),
          createdDate: data.createdDate,
          officeId: data.officeId,
          accountId: data.accountId,
          officeName: data.officeName
        };
      },
      error: (err) => {
        console.error('Error loading employee details:', err);
        this.errorMessage = 'Failed to load employee details. Please try again later.';
      }
    });
  }

  private loadOffices(): void {
    this.officeService.getAllOffices().subscribe({
      next: (data) => {
        this.offices = data;
      },
      error: (err) => {
        console.error('Error loading office data:', err);
        this.errorMessage = 'Failed to load office data. Please try again later.';
      }
    });
  }

  onSubmit(): void {
    if (this.employee) {
      console.log('Submitting employee data:', this.employee);

      this.employeeService.updateEmployee(this.employee.id, this.employee).subscribe({
        next: () => {
          this.successMessage = 'Employee updated successfully!';
          this.errorMessage = null;
          this.router.navigate(['/admin/employees']);
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          this.errorMessage = 'Failed to update employee. Please try again later.';
          this.successMessage = null;
        }
      });
    }
  }
}
