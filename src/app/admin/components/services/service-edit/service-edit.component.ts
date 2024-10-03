import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../../toast.service';

@Component({
  selector: 'app-service-edit',
  templateUrl: './service-edit.component.html',
  styleUrls: ['./service-edit.component.css'],
})
export class ServiceEditComponent implements OnInit {
  @Input() serviceId: string | null = null;
  @Output() updateSuccess: EventEmitter<void> = new EventEmitter<void>(); // Phát ra sự kiện khi cập nhật thành công

  updateServiceForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private serviceService: ServiceService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
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
        this.toastService.showToast('An unexpected error occurred', 'danger');
      },
    });
  }

  onSubmit(): void {
    if (this.serviceId) {
      if (this.updateServiceForm.valid) {
        this.isSubmitting = true;
        const formValue = this.updateServiceForm.value;
        const requestBody = {
          id: this.serviceId,
          name: formValue.name,
          baseRate: formValue.baseRate,
          ratePerKg: formValue.ratePerKg,
          ratePerKm: formValue.ratePerKm,
        };
        console.log(requestBody);
        this.serviceService
          .updateService(this.serviceId, requestBody)
          .subscribe({
            next: (response) => {
              this.toastService.showToast('Update successfully', 'success');
              this.isSubmitting = false;
              this.updateSuccess.emit(); // Phát ra sự kiện khi cập nhật thành công
            },
            error: (err) => {
              this.toastService.showToast('An unexpected error occurred', 'danger');
              this.isSubmitting = false;
            },
          });
      } else {
        this.updateServiceForm.markAllAsTouched();
      }
    }
  }
}
