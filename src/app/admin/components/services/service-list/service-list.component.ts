import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../../models/service.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from "bootstrap";
import { ToastService } from '../../../../toast.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'],
})
export class ServiceListComponent implements OnInit {
  services: Service[] = [];
  isLoading = false;
  selectedServiceId: string | null = null;

  @ViewChild('createServiceModal') createServiceModal: any;
  @ViewChild('editServiceModal') editServiceModal: any;
  @ViewChild('detailServiceModal') detailServiceModal: any;
  @ViewChild('deletelServiceModal') deletelServiceModal: any;

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private modalService: NgbModal,
    private toastService: ToastService 
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  private loadServices(): void {
    this.isLoading = true;
    this.serviceService.getAllServices().subscribe(
      (data) => {
        this.services = data;
      },
      (error) => {
        console.error('Error fetching service data', error);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  openCreateServiceModal() {
    this.modalService.open(this.createServiceModal);
  }

  openDetailServiceModal(serviceId: string): void {
    this.selectedServiceId = serviceId;
    this.modalService.open(this.detailServiceModal, { centered: true });
  }

  openEditServiceModal(serviceId: string): void {
    this.selectedServiceId = serviceId;
    this.modalService.open(this.editServiceModal, { centered: true });
  }

  closeDetailServiceModal(modal: any): void {
    modal.close();
    this.loadServices();
  }

  openDeleteConfirmModal(serviceId: string) {
    this.selectedServiceId = serviceId;
    this.modalService.open(this.deletelServiceModal, { centered: true });
  }

  deleteService(modal: any): void {
    if (this.selectedServiceId) {
      this.serviceService.deleteService(this.selectedServiceId).subscribe({
        next: () => {
          modal.close();
          this.toastService.showToast('Delete successfully', 'success');
          this.loadServices();      
        },
        error: (err) => {
          console.error('Failed to delete service: ', err);
          modal.close();
          this.toastService.showToast('An unexpected error occurred', 'danger');
          this.loadServices();
        }
      })
    }
  }
}
