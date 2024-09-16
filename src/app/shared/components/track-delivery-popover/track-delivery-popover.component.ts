import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TrackingPopoverService } from "../../tracking-popover.service";
import { PackageDetailService } from '../../package-detail.service';
import { HttpClient } from '@angular/common/http';
import { PackageDetail } from '../../package-detail.model';

@Component({
  selector: 'app-track-delivery-popover',
  templateUrl: './track-delivery-popover.component.html',
  styleUrl: './track-delivery-popover.component.css'
})
export class TrackDeliveryPopoverComponent implements OnInit {
  @Input() isVisible: boolean | null = false;
  trackForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private trackingPopoverService: TrackingPopoverService,
    private packageDetailService: PackageDetailService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.trackForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Validates for 10-digit phone numbers
      packageId: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.trackForm.valid) {
      const { phoneNumber, packageId } = this.trackForm.value;
      const apiUrl = `https://localhost:7029/api/Customer/CheckPackageStatus?phone=${phoneNumber}&packageId=${packageId}`;

      this.trackingPopoverService.setVisibility(false);
      this.packageDetailService.setVisibility(true);
      this.packageDetailService.setLoadingState(true); // Kích hoạt trạng thái loading

      this.http.get<PackageDetail>(apiUrl).subscribe(
        (response) => {
          this.packageDetailService.setPackageDetail(response);         
        },
        (error) => {
          this.packageDetailService.setPackageDetail(null);          
        }
      );
    } else {
      this.trackForm.markAllAsTouched();
    }
  }

  get phoneNumber() {
    return this.trackForm.get('phoneNumber');
  }

  get packageId() {
    return this.trackForm.get('packageId');
  }

  closePopover() {
    this.trackingPopoverService.setVisibility(false);
  }
}
