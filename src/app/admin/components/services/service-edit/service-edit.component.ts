import { Component, Input, OnInit } from '@angular/core';
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
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    if (this.serviceId) {
      this.loadServiceDetails(this.serviceId);
    }
  }

  // Hàm lấy chi tiết service từ server
  private loadServiceDetails(id: string): void {
    this.serviceService.getServiceById(id).subscribe({
      next: (data) => {
        this.service = data;
        console.log('Loaded service data:', this.service);  
      },
      error: (err) => {
        console.error('Error loading service details:', err);
        this.errorMessage = 'Failed to load service details. Please try again later.';
      }
    });
  }

  onSubmit(): void {
    if (this.serviceId) {
      console.log('Submitting service data with ID:', this.serviceId);
  
      this.serviceService.updateService(this.serviceId, this.service).subscribe({
        next: (response) => {
          console.log('Update response:', response);
  
          // Xử lý khi phản hồi là chuỗi thay vì JSON
          if (typeof response === 'string') {
            // Kiểm tra nếu phản hồi chứa thông báo thành công
            if (response.includes('Service updated successfully')) {
              this.successMessage = 'Service updated successfully!';
              this.errorMessage = null;
            } else {
              this.errorMessage = 'Unexpected response: ' + response;
            }
          } else {
            this.errorMessage = 'Unexpected response format.';
          }
  
          setTimeout(() => {
            this.router.navigate(['/admin/services/list']);
          });
        },
        error: (err) => {
          console.error('Error updating service:', err);
          this.errorMessage = 'Failed to update service. Please try again later.';
          this.successMessage = null;
        }
      });
    }
  }
}
