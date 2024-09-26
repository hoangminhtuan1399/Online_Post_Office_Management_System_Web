import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../../models/service.model';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'],
})
export class ServiceListComponent implements OnInit {
  services: Service[] = [];
  isLoading = false;
  selectedServiceId: string | null = null;
  modalRef: NgbModalRef | null = null; // Quản lý tham chiếu modal

  @ViewChild('createServiceModal') createServiceModal: any;
  @ViewChild('editServiceModal') editServiceModal: any;
  @ViewChild('detailServiceModal') detailServiceModal: any;

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private modalService: NgbModal
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
    this.modalRef = this.modalService.open(this.detailServiceModal, { centered: true });  
  }

  openEditServiceModal(serviceId: string): void {
    this.selectedServiceId = serviceId; 
    this.modalRef = this.modalService.open(this.editServiceModal, { centered: true });  
  }

  closeDetailServiceModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
  
      
      window.location.reload();
    }
  }
  
  }
  


