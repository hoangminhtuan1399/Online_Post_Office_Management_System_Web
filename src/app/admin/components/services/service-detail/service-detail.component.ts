import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  @Input() serviceId: string | null = null;
  service: Service | null = null; 
  errorMessage: string | null = null;

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

  private loadServiceDetails(id: string): void {
    this.serviceService.getServiceById(id).subscribe({
      next: (data) => {
        this.service = data;
      },
      error: (err) => {
        console.error('Error loading service details:', err);
        this.errorMessage = 'Failed to load service details. Please try again later.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/services/list']);
  }
}
