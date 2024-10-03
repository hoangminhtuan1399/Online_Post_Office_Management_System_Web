import { Component, OnInit } from '@angular/core';
import { PaymentsService } from './payments.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  payments: any[] = [];
  paymentStatusFilter: string = '';
  selectedPayment: any = null;
  statusOptions: string[] = ['paid', 'pending', 'fail'];
  paymentFilterForm: FormGroup;
  currentStatusIndex: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  isLastPage: boolean = false;
  startDate: string = '';
  isLoading = false;

  constructor(
    private paymentsService: PaymentsService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.paymentFilterForm = this.fb.group({
      startDate: [''],
      paymentStatus: [''],
      page: [1]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.paymentFilterForm.patchValue({
        startDate: params['startDate'] || '',
        paymentStatus: params['paymentStatus'] || '',
        page: +params['page'] || 1,
        pageSize: params['pageSize'] || ''
      });
    })
    this.onSearch();
  }

  getPayments(): void {
    this.isLoading = true;
    this.paymentsService
      .getFilteredPayments(
        this.currentPage,
        this.itemsPerPage,
        this.paymentStatusFilter,
        this.startDate
      )
      .subscribe(
        (response) => {
          if (response) {
            this.payments = response;
          }
          this.isLastPage = response.length < this.itemsPerPage;
        },
        (error) => {
          console.error('Error fetching payment data:', error);
        },
        () => {
          this.isLoading = false;
        }
      );
  }


  nextPage(): void {
    if (!this.isLastPage) {
      this.paymentFilterForm.get('page')?.setValue(+this.currentPage + 1);
      this.onSearch();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.paymentFilterForm.get('page')?.setValue(+this.currentPage - 1);
      this.onSearch();
    }
  }

  onSearch() {
    const queryParams = this.getFilterQueryParam();
    this.router.navigate([], { queryParams });
    this.startDate = queryParams.startDate;
    this.paymentStatusFilter = queryParams.paymentStatus;
    this.currentPage = queryParams.page;
    this.getPayments();
  }

  onClear() {
    this.paymentFilterForm.reset({
      startDate: [''],
      paymentStatus: [''],
      page: 1
    });
    this.onSearch();
  }

  getFilterQueryParam() {
    return {
      startDate: this.paymentFilterForm.get('startDate')?.value || '',
      paymentStatus: this.paymentFilterForm.get('paymentStatus')?.value || '',
      page: this.paymentFilterForm.get('page')?.value || 1
    };
  }

  viewPayment(paymentId: string, content: any): void {
    this.paymentsService.getPaymentById(paymentId).subscribe(
      (response) => {
        this.selectedPayment = response;
        this.modalService.open(content, { centered: true });
      },
      (error) => {
        console.error('Error fetching payment details', error);
      }
    );
  }

  togglePaymentStatusFilter(): void {
    this.currentStatusIndex = (this.currentStatusIndex + 1) % this.statusOptions.length;
    this.paymentStatusFilter = this.statusOptions[this.currentStatusIndex].toLocaleLowerCase() || 'paid';
    this.getPayments();
  }
}
