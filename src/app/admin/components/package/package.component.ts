import { Component, OnInit } from '@angular/core';
import { PackageService } from './package.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from '../../../toast.service';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrl: './package.component.css',
})
export class PackageComponent implements OnInit {
  packages: any[] = [];
  paymentStatusFilter: string = '';
  selectedPackage: any = null;
  statusOptions: string[] = ['paid', 'pending', 'fail'];
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
  isLoading = false;

  constructor(
    private packageService: PackageService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.createPackageForm = this.fb.group({
      officeId: ['', Validators.required],
      serviceId: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0)]],
      distance: [0, [Validators.required, Validators.min(0)]],
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
      distance: [0, [Validators.required, Validators.min(0)]],
      receiver: ['', Validators.required],
      paymentStatus: ['', Validators.required],
    });
    this.packageFilterForm = this.fb.group({
      officeId: [''],
      startDate: [''],
      paymentStatus: [''],
      page: [1]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.packageFilterForm.patchValue({
        officeId: params['officeId'] || '',
        startDate: params['startDate'] || '',
        paymentStatus: params['paymentStatus'] || '',
        page: +params['page'] || 1
      });
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
    this.onSearch();
  }

  getPackages(): void {
    this.isLoading = true;
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
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  nextPage(): void {
    if (!this.isLastPage) {
      this.packageFilterForm.get('page')?.setValue(+this.currentPage + 1);
      this.onSearch();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.packageFilterForm.get('page')?.setValue(+this.currentPage - 1);
      this.onSearch();
    }
  }

  openUpdatePackageModal(content: any, pkg: any): void {
    this.selectedPackage = pkg;
    console.log('pkg: ', pkg)
    this.updatePackageForm.patchValue({
      deliveryStatus: pkg.deliveryStatus,
      currentLocation: pkg.officeId,
      weight: pkg.weight,
      distance: pkg.distance,
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
        startOfficeId: this.selectedPackage.officeId,
        currentLocation: formValue.currentLocation,
        endOfficeId: this.selectedPackage.endOfficeName,
        deliveryDate: formValue.deliveryStatus === 'delivered' || formValue.deliveryStatus === 'declined'
          ? new Date().toISOString()
          : this.selectedPackage.deliveryDate,
      };

      const packageRequestBody = {
        id: this.selectedPackage.id,
        weight: formValue.weight,
        distance: formValue.distance,
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
                  this.toastService.showToast('Update successfully', 'success');
                  this.isSubmitting = false;
                  this.modalService.dismissAll();
                  this.onSearch();
                },
                (error) => {
                  this.toastService.showToast('An unexpected error occurred', 'danger');
                  console.error('Error updating payment', error);
                  this.isSubmitting = false;
                }
              );
            },
            (error) => {
              this.toastService.showToast('An unexpected error occurred', 'danger');
              console.error('Error updating package', error);
              this.isSubmitting = false;
            }
          );
        },
        (error) => {
          this.toastService.showToast('An unexpected error occurred', 'danger');
          console.error('Error updating delivery', error);
          this.isSubmitting = false;
        }
      );
    } else {
      this.updatePackageForm.markAllAsTouched();
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
          distance: formValue.distance,
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
          this.toastService.showToast('Create successfully', 'success');
          this.modalService.dismissAll();
          this.isSubmitting = false;
          this.onSearch();
        },
        (error) => {
          this.toastService.showToast('An unexpected error occurred', 'danger');
          console.error('Error creating package', error);
          this.isSubmitting = false;
        }
      );
    } else {
      this.createPackageForm.markAllAsTouched();
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

  onSearchButtonClick() {
    this.packageFilterForm.setValue({
      ...this.packageFilterForm.value,
      page: 1
    }, {
      onlySelf: true
    })
    this.onSearch();
  }

  onSearch() {
    const queryParams = this.getFilterQueryParam();
    this.router.navigate([], { queryParams });
    this.officeIdFilter = queryParams.officeId;
    this.startDate = queryParams.startDate;
    this.paymentStatusFilter = queryParams.paymentStatus;
    this.currentPage = queryParams.page;
    this.getPackages();
  }

  onClear() {
    this.packageFilterForm.reset({
      officeId: [''],
      startDate: [''],
      paymentStatus: [''],
      page: 1
    });
    this.onSearch();
  }

  getFilterQueryParam() {
    return {
      officeId: this.packageFilterForm.get('officeId')?.value || '',
      startDate: this.packageFilterForm.get('startDate')?.value || '',
      paymentStatus: this.packageFilterForm.get('paymentStatus')?.value || '',
      page: this.packageFilterForm.get('page')?.value || 1
    };
  }
}
