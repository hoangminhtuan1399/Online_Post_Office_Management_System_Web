import { Component, EventEmitter, Output } from '@angular/core';
import { ServiceService } from '../../services/service.service'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceListComponent } from '../service-list/service-list.component';

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.css'],
})
export class ServiceCreateComponent {
  @Output() createSuccess: EventEmitter<void> = new EventEmitter<void>(); // Phát ra sự kiện khi cập nhật thành công

  errorMessage: string | null = null;
  successMessage: string | null = null;
  createServiceForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private serviceService: ServiceService,
    private serviceList: ServiceListComponent,
    private fb: FormBuilder
  ) {
    this.createServiceForm = this.fb.group({
      name: ['', Validators.required],
      baseRate: [0, [Validators.required, Validators.min(0)]],
      ratePerKg: [0, [Validators.required, Validators.min(0)]],
      ratePerKm: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.createServiceForm.valid) {
      this.isSubmitting = true;
      const formValue = this.createServiceForm.value;
      const requestBody = {
        id: '',
        name: formValue.name,
        baseRate: formValue.baseRate,
        ratePerKg: formValue.ratePerKg,
        ratePerKm: formValue.ratePerKm,
      };
      this.serviceService.createService(requestBody).subscribe({
        next: () => {
          this.successMessage = 'Service created successfully!';
          this.errorMessage = null;
          this.isSubmitting = false;
          this.createSuccess.emit();
        },
        error: (err) => {
          console.error('Error creating service:', err);
          this.errorMessage = 'Failed to create service. Please try again.';
          this.successMessage = null;
          this.isSubmitting = false;
        },
      });
    } else {
      this.createServiceForm.markAllAsTouched();
    }
  }
}
