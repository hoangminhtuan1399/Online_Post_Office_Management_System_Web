import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../employees/employee.service';
import { Employee } from '../../../models/employee.model';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfficeService } from '../../offices/office.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: any [] = [];
  filteredEmployees: any [] = [];
  offices: any [] = [];
  searchTerm: string = ''; 
  isLoading = false;
  selectedEmployeeId: string | null = null;
  @ViewChild('createPackageModal') createPackageModal: any;
  @ViewChild('editPackageModal') editPackageModal: any;
  @ViewChild('detailPackageModal') detailPackageModal: any;
  

  constructor(
    private employeeService: EmployeeService, 
    private modalService: NgbModal,
    private officeService: OfficeService
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    this.isLoading = true;
    this.officeService.getAllOffices().subscribe({
      next: (data) => {
        this.offices = data;
      },
      error: (error) => {
        console.error('Error fetching offices', error);
      }
    });
    this.employeeService.getAllEmployees().subscribe(
      (data) => {
      this.employees = data;
      this.filteredEmployees = data;  
      },
      (error) => {
        console.error('Error fetching Employee data', error);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  getOfficeName(officeId: string): string {
    const office = this.offices.find(o => o.id == officeId);
    return office ? office.officeName : 'Unknown Office';
  }

  onSearch(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTermLower) ||  
      employee.email.toLowerCase().includes(searchTermLower)    
    );
  }

  openCreatePackageModal() {
    this.modalService.open(this.createPackageModal);
  }

  openDetailPackageModal(employeeId: string): void {
    this.selectedEmployeeId = employeeId;  // Lưu ID của nhân viên
    this.modalService.open(this.detailPackageModal, { centered: true });  // Mở modal
  }
  
  openEditPackageModal(employeeId: string): void {
    this.selectedEmployeeId = employeeId;  // Lưu ID của nhân viên
    this.modalService.open(this.editPackageModal, { centered: true });  // Mở modal
  }
}
