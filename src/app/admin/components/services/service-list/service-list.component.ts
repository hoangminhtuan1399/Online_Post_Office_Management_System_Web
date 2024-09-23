import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service'; 
import { Service } from '../../../models/service.model'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'] 
})
export class ServiceListComponent implements OnInit {
  services: Service[] = [];

  constructor(private serviceService: ServiceService, private router: Router) { }

  ngOnInit(): void {
    this.loadServices();
  }

  private loadServices(): void {
    this.serviceService.getAllServices().subscribe(data => {
      this.services = data;
    });
  }
}
