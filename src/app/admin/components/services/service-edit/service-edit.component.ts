import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../../models/service.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-service-edit',
  templateUrl: './service-edit.component.html',
  styleUrls: ['./service-edit.component.css'],
})
export class ServiceEditComponent implements OnInit {
  @Input() serviceId: string | null = null;
  @Output() updateSuccess: EventEmitter<void> = new EventEmitter<void>(); // Phát ra sự kiện khi cập nhật thành công

  updateServiceForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting: boolean = false;

  constructor(private serviceService: ServiceService, private fb: FormBuilder) {
    this.updateServiceForm = this.fb.group({
      name: ['', Validators.required],
      baseRate: [0, [Validators.required, Validators.min(0)]],
      ratePerKg: [0, [Validators.required, Validators.min(0)]],
      ratePerKm: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    if (this.serviceId) {
      this.loadServiceDetails(this.serviceId);
    }
  }

  private loadServiceDetails(id: string): void {
    this.serviceService.getServiceById(id).subscribe({
      next: (data) => {
        this.updateServiceForm.patchValue({
          name: data.name,
          baseRate: data.baseRate,
          ratePerKg: data.ratePerKg,
          ratePerKm: data.ratePerKm,
        });
      },
      error: (err) => {
        this.errorMessage =
          'Failed to load service details. Please try again later.';
      },
    });
  }

  onSubmit(): void {
    if (this.serviceId) {
      if (this.updateServiceForm.valid) {
        this.isSubmitting = true;
        const formValue = this.updateServiceForm.value;
        const requestBody = {
          id: '',
          name: formValue.name,
          baseRate: formValue.baseRate,
          ratePerKg: formValue.ratePerKg,
          ratePerKm: formValue.ratePerKm,
        };
        this.serviceService
          .updateService(this.serviceId, requestBody)
          .subscribe({
            next: (response) => {
              if (
                response &&
                response.message === 'Service updated successfully.'
              ) {
                this.successMessage = 'Service updated successfully!';
                this.errorMessage = null;
                this.isSubmitting = false;
                this.updateSuccess.emit(); // Phát ra sự kiện khi cập nhật thành công
              } else {
                this.errorMessage = 'Unexpected message: ' + response.message;
              }
            },
            error: (err) => {
              this.errorMessage =
                'Failed to update service. Please try again later.';
              this.isSubmitting = false;
            },
          });
      } else {
        this.updateServiceForm.markAllAsTouched();
      }
    }
  }
}
