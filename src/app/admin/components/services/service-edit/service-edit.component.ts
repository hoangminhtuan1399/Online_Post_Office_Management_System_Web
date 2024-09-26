import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-service-edit',
  templateUrl: './service-edit.component.html',
  styleUrls: ['./service-edit.component.css']
})
export class ServiceEditComponent implements OnInit {
  @Input() serviceId: string | null = null;
  @Output() updateSuccess: EventEmitter<void> = new EventEmitter<void>(); // Phát ra sự kiện khi cập nhật thành công
  service: Service = {
    id: '',
    name: '',
    baseRate: 0,
    ratePerKg: 0,
    ratePerKm: 0
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    if (this.serviceId) {
      this.loadServiceDetails(this.serviceId);
    }
  }

  private loadServiceDetails(id: string): void {
    this.serviceService.getServiceById(id).subscribe({
      next: (data) => {
        this.service = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load service details. Please try again later.';
      }
    });
  }

  onSubmit(): void {
    if (this.serviceId) {
      this.serviceService.updateService(this.serviceId, this.service).subscribe({
        next: (response) => {
          if (response && response.message === 'Service updated successfully.') {
            this.successMessage = 'Service updated successfully!';
            this.errorMessage = null;
            this.updateSuccess.emit(); // Phát ra sự kiện khi cập nhật thành công
          } else {
            this.errorMessage = 'Unexpected message: ' + response.message;
          }
        },
        error: (err) => {
          this.errorMessage = 'Failed to update service. Please try again later.';
        }
      });
    }
  }
}
