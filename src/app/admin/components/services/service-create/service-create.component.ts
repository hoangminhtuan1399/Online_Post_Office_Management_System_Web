import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';  // Giả sử bạn đã có ServiceService để xử lý API
import { Service } from '../../../models/service.model';  // Import interface Service

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.css']
})
export class ServiceCreateComponent {
  service: Service = {
    id: '',
    name: '',
    baseRate: 0,
    ratePerKg: 0,
    ratePerKm: 0
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private serviceService: ServiceService, private router: Router) {}

  onSubmit(): void {
    console.log('Creating new service:', this.service);
    this.serviceService.createService(this.service).subscribe({
      next: () => {
        this.successMessage = 'Service created successfully!';
        this.errorMessage = null;
        this.router.navigate(['/admin/services/list']); 
      },
      error: (err) => {
        console.error('Error creating service:', err);
        this.errorMessage = 'Failed to create service. Please try again.';
        this.successMessage = null;
      }
    });
  }
}
