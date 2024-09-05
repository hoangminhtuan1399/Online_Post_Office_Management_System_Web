import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TrackingPopoverService } from "../../tracking-popover.service";

@Component({
  selector: 'app-track-delivery-popover',
  templateUrl: './track-delivery-popover.component.html',
  styleUrl: './track-delivery-popover.component.css'
})
export class TrackDeliveryPopoverComponent implements OnInit {
  @Input() isVisible: boolean | null = false;
  trackForm!: FormGroup;

  constructor(private fb: FormBuilder, private trackingPopoverService: TrackingPopoverService) {

  }

  ngOnInit(): void {
    this.trackForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Validates for 10-digit phone numbers
      packageId: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.trackForm.valid) {
      const { phoneNumber, packageId } = this.trackForm.value;
      console.log('Phone Number:', phoneNumber);
      console.log('Package ID:', packageId);
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
