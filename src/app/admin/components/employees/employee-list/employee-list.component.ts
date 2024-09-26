import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../employees/employee.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfficeService } from '../../offices/office.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  offices: any[] = [];
  searchTermName: string = ''; // Trường tìm kiếm cho tên
  searchTermPhone: string = ''; // Trường tìm kiếm cho số điện thoại
  searchTermOfficeName: string = ''; // Trường tìm kiếm cho tên văn phòng
  isLoading = false;
  selectedEmployeeId: string | null = null;

  @ViewChild('createEmployeeModal') createEmployeeModal: any;
  @ViewChild('editEmployeeModal') editEmployeeModal: any;
  @ViewChild('detailEmployeeModal') detailEmployeeModal: any;

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
    
    // Tải dữ liệu văn phòng trước
    this.officeService.getAllOffices().subscribe({
      next: (data) => {
        this.offices = data;
      },
      error: (error) => {
        console.error('Error fetching offices', error);
      }
    });

    // Tải dữ liệu nhân viên
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
    const office = this.offices.find(o => o.id === officeId);
    return office ? office.officeName : 'Unknown Office';
  }

  // Tìm kiếm nhân viên theo name, phone, officeId hoặc officeName
  onSearch(): void {
    this.isLoading = true;

    const name = this.searchTermName && this.searchTermName.trim() !== '' ? this.searchTermName : undefined;
    const phone = this.searchTermPhone && this.searchTermPhone.trim() !== '' ? this.searchTermPhone : undefined;
    const officeName = this.searchTermOfficeName && this.searchTermOfficeName.trim() !== '' ? this.searchTermOfficeName : undefined;

    this.employeeService.searchEmployees(name, undefined, phone, officeName).subscribe(
      (data) => {
        this.filteredEmployees = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error searching employees', error);
        this.isLoading = false;
      }
    );
  }

  openCreateEmployeeModal() {
    this.modalService.open(this.createEmployeeModal);
  }

  openDetailEmployeeModal(employeeId: string): void {
    this.selectedEmployeeId = employeeId;  
    this.modalService.open(this.detailEmployeeModal, { centered: true });  
  }
  
  openEditEmployeeModal(employeeId: string): void {
    this.selectedEmployeeId = employeeId; 
    this.modalService.open(this.editEmployeeModal, { centered: true });  
  }
}
