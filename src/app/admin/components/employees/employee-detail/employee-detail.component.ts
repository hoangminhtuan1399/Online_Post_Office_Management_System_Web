import { Component, Input, OnInit } from '@angular/core';
import { EmployeeService } from '../../employees/employee.service';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  @Input() employeeId: string | null = null;
  employee: Employee | null = null;  
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    if (this.employeeId) {
      this.loadEmployeeDetails(this.employeeId);
    } else {
      this.error = 'No employee ID provided.';
      this.loading = false;
    }
  }

  private loadEmployeeDetails(id: string): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employee = data;
        this.loading = false;
      },
      error: (err) => {
        this.handleError(err);
        this.loading = false;
      }
    });
  }

  private handleError(err: any): void {
    if (err.status === 401) {
      this.error = 'Unauthorized: Please log in again.';
    } else if (err.status === 404) {
      this.error = 'Employee not found.';
    } else {
      this.error = 'Failed to load employee details. Please try again later.';
    }
  }
}
