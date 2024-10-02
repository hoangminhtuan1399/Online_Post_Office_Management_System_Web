import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../employees/employee.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfficeService } from '../../offices/office.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../toast.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  offices: any[] = [];
  isLoading = false;
  selectedEmployeeId: string | null = null;
  empFilterForm: FormGroup;
  nameFilter: string = '';
  phoneFilter: string = '';
  officeFilter: string = '';
  officeIdFilter: string = '';
  currentPage: number = 1;
  isLastPage: boolean = false;
  itemsPerPage: number = 10;

  @ViewChild('createEmployeeModal') createEmployeeModal: any;
  @ViewChild('editEmployeeModal') editEmployeeModal: any;
  @ViewChild('detailEmployeeModal') detailEmployeeModal: any;
  @ViewChild('deleteConfirmModal') deleteConfirmModal: any;

  constructor(
    private employeeService: EmployeeService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private officeService: OfficeService,
    private router: Router,
    private toastService: ToastService 
  ) {
    this.empFilterForm = this.fb.group({
      name: [''],
      officeId: [''],
      phone: [''],
      officeName: [''],
      page: [1]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.route.queryParams.subscribe(params => {
      this.empFilterForm.patchValue({
        name: params['name'] || '',
        officeId: params['officeId'] || '',
        phone: params['phone'] || '',
        officeName: params['officeName'] || '',
        page: +params['page'] || 1
      });
    })
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
    this.employeeService.searchEmployees(this.nameFilter, this.officeIdFilter, this.phoneFilter, this.officeFilter, this.currentPage).subscribe(
      (data) => {
        this.employees = data;
        this.isLastPage = data.length < this.itemsPerPage;
      },
      (error) => {
        console.error('Error fetching Employee data', error);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  nextPage(): void {
    if (!this.isLastPage) {
      this.empFilterForm.get('page')?.setValue(+this.currentPage + 1);
      this.onSearch();
    }
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.empFilterForm.get('page')?.setValue(+this.currentPage - 1);
      this.onSearch();
    }
  }

  getOfficeName(officeId: string): string {
    const office = this.offices.find(o => o.id === officeId);
    return office ? office.officeName : 'Unknown Office';
  }

  // Tìm kiếm nhân viên theo name, phone, officeId hoặc officeName
  onSearch(): void {
    const queryParams = this.getFilterQueryParam();
    this.router.navigate([], { queryParams });
    this.nameFilter = queryParams.name;
    this.officeIdFilter = queryParams.officeId;
    this.phoneFilter = queryParams.phone;
    this.officeFilter = queryParams.officeName;
    this.currentPage = queryParams.page;
    this.loadEmployees();
  }

  onClear() {
    this.empFilterForm.reset({
      name: [''],
      officeId: [''],
      phone: [''],
      officeName: [''],
      page: 1
    });
    this.onSearch();
  }

  getFilterQueryParam() {
    return {
      name: this.empFilterForm.get('name')?.value || '',
      officeId: this.empFilterForm.get('officeId')?.value || '',
      phone: this.empFilterForm.get('phone')?.value || '',
      officeName: this.empFilterForm.get('officeName')?.value || '',
      page: this.empFilterForm.get('page')?.value || 1
    };
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

  closeModal(modal: any): void {
    modal.close();
    this.loadEmployees();
  }

  openDeleteConfirmModal(employeeId: string) {
    this.selectedEmployeeId = employeeId;
    this.modalService.open(this.deleteConfirmModal, { centered: true });
  }

  deleteEmployee(modal: any): void {
    if (this.selectedEmployeeId) {
      this.employeeService.deleteEmployee(this.selectedEmployeeId).subscribe({
        next: () => {
          modal.close();
          this.toastService.showToast('Login successfully', 'success');
          this.loadEmployees();
        },
        error: (err) => {
          console.error('Failed to delete employee:', err);
          modal.dismiss();
          this.toastService.showToast('An unexpected error occurred', 'danger')
          this.loadEmployees();
        }
      });
    }
  }
}
