import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../employees/employee.service';
import { Employee } from '../../../models/employee.model';
import { Office } from '../../../models/office.model';
import { OfficeService } from '../../offices/office.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css'],
})
export class EmployeeEditComponent implements OnInit {
  @Input() employeeId: string | null = null;
  @Output() updateSuccess: EventEmitter<void> = new EventEmitter<void>(); // Phát ra sự kiện khi cập nhật thành công
  employee: any;
  offices: any[] = [];
  updateEmpForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private officeService: OfficeService
  ) {
    this.updateEmpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      officeId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.employeeId) {
      this.loadEmployeeDetails(this.employeeId);
    }
    this.loadOffices();
  }

  private loadEmployeeDetails(id: string): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employee = data;
        this.updateEmpForm.patchValue({
          name: data.name,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          dateOfBirth: this.formatDate(new Date(data.dateOfBirth).toString()),
          officeId: data.officeId,
          officeName: data.officeName,
        });
      },
      error: (err) => {
        console.error('Error loading employee details:', err);
        this.errorMessage =
          'Failed to load employee details. Please try again later.';
      },
    });
  }

  getOfficeName(officeId: string): string {
    const office = this.offices.find(o => o.id === officeId);
    return office ? office.officeName : 'Unknown Office';
  }

  private loadOffices(): void {
    this.officeService.getAllOffices().subscribe({
      next: (data) => {
        this.offices = data;
      },
      error: (err) => {
        console.error('Error loading office data:', err);
        this.errorMessage =
          'Failed to load office data. Please try again later.';
      },
    });
  }

  onSubmit(): void {
    if (this.employeeId) {
      if (this.updateEmpForm.valid) {
        this.isSubmitting = true;
        const formValue = this.updateEmpForm.value;
        const requestBody = {
          id: this.employeeId,
          name: formValue.name,
          email: formValue.email,
          phone: formValue.phone,
          gender: formValue.gender,
          dateOfBirth: new Date(formValue.dateOfBirth),
          createdDate: new Date(this.employee.createdDate),
          officeId: formValue.officeId,
          accountId: this.employee.accountId,
          officeName: this.getOfficeName(formValue.officeId),
        };

        console.log(requestBody)
        this.employeeService
          .updateEmployee(this.employeeId, requestBody)
          .subscribe({
            next: () => {
              this.successMessage = 'Employee updated successfully!';
              this.errorMessage = null;
              this.isSubmitting = false;
              this.updateSuccess.emit();
            },
            error: (err) => {
              console.error('Error updating employee:', err);
              this.errorMessage =
                'Failed to update employee. Please try again later.';
              this.successMessage = null;
              this.isSubmitting = false;
            },
          });
      } else {
        this.updateEmpForm.markAllAsTouched();
      }
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + date.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
