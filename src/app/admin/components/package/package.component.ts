import { Component, OnInit } from '@angular/core';
import { PackageService } from './package.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrl: './package.component.css',
})
export class PackageComponent implements OnInit {
  packages: any[] = [];
  paymentStatusFilter: string = '';
  selectedPackage: any = null;
  statusOptions: string[] = ['paid', 'pending', 'fail', ''];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  isLastPage: boolean = false;
  isSubmitting: boolean = false;
  createPackageForm: FormGroup;
  updatePackageForm: FormGroup;
  serviceOptions: any[] = [];
  officeIdFilter: string = '';
  startDate: string = '';
  officeOptions: { id: string; name: string }[] = [];
  officeOptionsForCreate: any[] = [];
  packageFilterForm: FormGroup;

  constructor(
    private packageService: PackageService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createPackageForm = this.fb.group({
      officeId: ['', Validators.required],
      serviceId: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0)]],
      receiver: ['', Validators.required],
      paymentStatus: ['', Validators.required],
      descriptionText: ['', Validators.required],
      receiverAddress: ['', Validators.required],
      deliveryStatus: ['', Validators.required],
      endOfficeId: ['', Validators.required],
      customerName: ['', Validators.required],
      customerPhone: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
    });
    this.updatePackageForm = this.fb.group({
      deliveryStatus: ['', Validators.required],
      currentLocation: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0)]],
      receiver: ['', Validators.required],
      paymentStatus: ['', Validators.required],
    });
    this.packageFilterForm = this.fb.group({
      office: [''],
      startDate: [''],
      paymentStatus: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.packageFilterForm.patchValue({
        office: params['office'] || '',
        startDate: params['startDate'] || '',
        paymentStatus: params['paymentStatus'] || ''
      });
      // Lấy giá trị phân trang từ URL params nếu có
      this.currentPage = params['page'] ? +params['page'] : this.currentPage;
    })
    this.packageService.getAllOffice().subscribe(
      (offices: any[]) => {
        this.officeOptions = offices.map(office => {
          return {
            id: office.id,
            name: office.officeName
          }
        });
      },
      (error) => {
        console.error('Error fetching offices', error);
      }
    );
    this.getPackages();
  }

  getPackages(): void {
    this.packageService
      .getFilteredPackages(
        this.currentPage,
        this.officeIdFilter,
        this.startDate,
        this.paymentStatusFilter
      )
      .subscribe(
        (response) => {
          this.packages = response;
          this.isLastPage = response.length < this.itemsPerPage;
        },
        (error) => {
          console.error('Error fetching package data', error);
        }
      );
  }

  nextPage(): void {
    if (!this.isLastPage) {
      this.currentPage++;
      this.getPackages();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getPackages();
    }
  }

  openUpdatePackageModal(content: any, pkg: any): void {
    this.selectedPackage = pkg;
    this.updatePackageForm.patchValue({
      deliveryStatus: pkg.deliveryStatus,
      currentLocation: pkg.currentLocation,
      weight: pkg.weight,
      receiver: pkg.receiver,
      paymentStatus: pkg.paymentStatus,
    });
    this.modalService.open(content, { centered: true });
    this.packageService.getAllOffice().subscribe(
      (offices) => {
        this.officeOptionsForCreate = offices;
      },
      (error) => {
        console.error('Error fetching offices', error);
      }
    );
  }

  onSubmitUpdate(): void {
    if (this.updatePackageForm.valid) {
      this.isSubmitting = true;
      const formValue = this.updatePackageForm.value;

      const deliveryRequestBody = {
        id: this.selectedPackage.deliveryId,
        sendDate: this.selectedPackage.sendDate,
        deliveryStatus: formValue.deliveryStatus,
        startOfficeId: this.selectedPackage.startOfficeId,
        currentLocation: formValue.currentLocation,
        endOfficeId: this.selectedPackage.endOfficeId,
        deliveryDate: formValue.deliveryStatus === 'delivered' || formValue.deliveryStatus === 'declined'
          ? new Date().toISOString()
          : this.selectedPackage.deliveryDate,
      };

      const packageRequestBody = {
        id: this.selectedPackage.id,
        weight: formValue.weight,
        distance: this.selectedPackage.distance,
        deliveryNumber: this.selectedPackage.deliveryNumber,
        receiver: formValue.receiver,
        createdAt: this.selectedPackage.createdAt,
      };

      const paymentRequestBody = {
        id: this.selectedPackage.paymentId,
        status: formValue.paymentStatus,
        transactionTime: formValue.paymentStatus === 'paid' || formValue.paymentStatus === 'fail'
          ? new Date().toISOString()
          : this.selectedPackage.transactionTime,
        cost: this.selectedPackage.paymentCost,
      };

      this.packageService.updateDelivery(this.selectedPackage.deliveryId, deliveryRequestBody).subscribe(
        () => {
          this.packageService.updatePackage(this.selectedPackage.id, packageRequestBody).subscribe(
            () => {
              this.packageService.updatePayment(this.selectedPackage.paymentId, paymentRequestBody).subscribe(
                () => {
                  console.log('All updates successful');
                  this.isSubmitting = false;
                  this.modalService.dismissAll();
                  this.getPackages();
                },
                (error) => {
                  console.error('Error updating payment', error);
                  this.isSubmitting = false;
                }
              );
            },
            (error) => {
              console.error('Error updating package', error);
              this.isSubmitting = false;
            }
          );
        },
        (error) => {
          console.error('Error updating delivery', error);
          this.isSubmitting = false;
        }
      );
    }
  }

  openCreatePackageModal(content: any): void {
    this.modalService.open(content, { centered: true });
    this.packageService.getAllServices().subscribe(
      (services) => {
        this.serviceOptions = services;
      },
      (error) => {
        console.error('Error fetching services', error);
      }
    );
    this.packageService.getAllOffice().subscribe(
      (offices) => {
        this.officeOptionsForCreate = offices;
      },
      (error) => {
        console.error('Error fetching offices', error);
      }
    );
  }

  onSubmit(): void {
    if (this.createPackageForm.valid) {
      this.isSubmitting = true;

      const formValue = this.createPackageForm.value;
      const requestBody = {
        package: {
          id: '',
          officeId: formValue.officeId,
          senderId: '',
          serviceId: formValue.serviceId,
          weight: formValue.weight,
          distance: 0,
          deliveryNumber: '',
          descriptionId: '',
          paymentId: '',
          deliveryId: '',
          receiver: formValue.receiver,
          createdAt: new Date().toISOString(),
        },
        payment: {
          id: '',
          status: formValue.paymentStatus,
          transactionTime: new Date().toISOString(),
          cost: 0,
        },
        description: {
          id: '',
          descriptionText: formValue.descriptionText,
          receiverAddress: formValue.receiverAddress,
        },
        delivery: {
          id: '',
          sendDate: new Date().toISOString(),
          deliveryStatus: formValue.deliveryStatus,
          startOfficeId: formValue.officeId,
          currentLocation: '',
          endOfficeId: formValue.endOfficeId,
          deliveryDate: new Date().toISOString(),
        },
        customer: {
          id: '',
          name: formValue.customerName,
          phone: formValue.customerPhone,
          email: formValue.customerEmail,
        },
      };

      this.packageService.createPackage(requestBody).subscribe(
        (response) => {
          console.log('Package created:', response);
          this.modalService.dismissAll();
          this.isSubmitting = false;
          this.getPackages();
        },
        (error) => {
          console.error('Error creating package', error);
          this.isSubmitting = false;
        }
      );

      console.log(requestBody);
    }
  }

  viewPackage(packageId: string, content: any): void {
    this.packageService.getPackageById(packageId).subscribe(
      (response) => {
        this.selectedPackage = response;
        this.modalService.open(content, { centered: true });
      },
      (error) => {
        console.error('Error fetching package details', error);
      }
    );
  }

  onSearch() {
    const queryParams = {
      office: this.packageFilterForm.get('office')?.value || '',
      startDate: this.packageFilterForm.get('startDate')?.value || '',
      paymentStatus: this.packageFilterForm.get('paymentStatus')?.value || ''
    };

    this.router.navigate([], { queryParams });
    this.officeIdFilter = queryParams.office;
    this.startDate = queryParams.startDate;
    this.paymentStatusFilter = queryParams.paymentStatus;
    this.getPackages();
  }
}
