import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { OfficeService } from '../../offices/office.service';
import { Employee } from '../../../models/employee.model';
import { Office } from '../../../models/office.model';
import { Account } from '../../../models/account.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../../toast.service';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css'],
})
export class EmployeeCreateComponent implements OnInit {
  @Output() createSuccess: EventEmitter<void> = new EventEmitter<void>();
  createEmpForm: FormGroup;
  offices: Office[] = [];
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private officeService: OfficeService,
    private fb: FormBuilder,
    private toastService: ToastService 
  ) {
    this.createEmpForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      officeId: ['', Validators.required],
    },  {
      validator: this.passwordsMatchValidator  // Thêm custom validator
    });
  }

  private passwordsMatchValidator(control: AbstractControl): void | null {
    const password = control.get('password')?.value || '';
    const confirmPassword = control.get('confirmPassword')?.value || '!!@@##$$';
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      return null;
    }
  }

  ngOnInit(): void {
    this.loadOffices();
  }

  loadOffices(): void {
    this.officeService.getAllOffices().subscribe({
      next: (offices) => {
        this.offices = offices;
      },
      error: (error) => {
        this.toastService.showToast('An unexpected error occurred', 'danger');
        console.error('Error fetching offices', error);
      },
    });
  }

  createEmployeeAndAccount(): void {
    if (this.createEmpForm.valid) {
      this.isSubmitting = true;
      const formValue = this.createEmpForm.value;
      const requestAccount = {
        id: '',
        username: formValue.username,
        password: formValue.password,
        roleId: '',
      };
      const requestEmployee = {
        id: '',
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        gender: formValue.gender,
        dateOfBirth: new Date(formValue.dateOfBirth),
        createdDate: new Date().toISOString(),
        officeId: formValue.officeId,
        accountId: '',
        officeName: '',
      };

      this.employeeService
        .createEmployeeWithAccount(requestEmployee, requestAccount)
        .subscribe({
          next: () => {
            this.toastService.showToast('Create successfully', 'success');
            this.isSubmitting = false;
            this.createSuccess.emit();
          },
          error: (error) => {
            this.toastService.showToast('An unexpected error occurred', 'danger');
            this.isSubmitting = false;
          },
        });
    } else {
      this.createEmpForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
