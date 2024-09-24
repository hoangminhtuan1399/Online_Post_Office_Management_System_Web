import { Component, OnInit } from '@angular/core';
import { PaymentsService } from './payments.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  payments: any[] = [];
  paymentStatusFilter: string = 'paid'; // Giá trị mặc định hợp lệ cho PaymentStatus
  selectedPayment: any = null;
  statusOptions: string[] = ['paid', 'pending', 'fail', ''];
  currentStatusIndex: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  isLastPage: boolean = false;
  startDate: string = '';

  constructor(
    private paymentsService: PaymentsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.startDate = this.getDefaultStartDate();
    this.getPayments();
  }

  getDefaultStartDate(): string {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1); 
    return currentDate.toISOString().split('T')[0];
  }

  getPayments(): void {
    this.paymentsService
      .getPayments(this.currentPage, this.itemsPerPage, this.paymentStatusFilter, this.startDate)
      .subscribe(
        (response) => {
          //console.log('API Response:', response);
          if (response) {
            this.payments = response;
          }
        },
        (error) => {
          console.error('Error fetching payment data:', error);
        }
      );
  }
  

  nextPage(): void {
    if (!this.isLastPage) {
      this.currentPage++;
      this.getPayments();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getPayments();
    }
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
    this.paymentStatusFilter = this.statusOptions[this.currentStatusIndex].toLocaleLowerCase() || 'paid'; // Giá trị mặc định khi không có trạng thái
    this.getPayments();
  }
}
