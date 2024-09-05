import { Component, Input, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { TrackingPopoverService } from "../../tracking-popover.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  @Input() socialIcons!: any[];
  isTrackingPopoverVisible$: Observable<boolean>;

  constructor(private trackingPopoverService: TrackingPopoverService) {
    this.isTrackingPopoverVisible$ = this.trackingPopoverService.isTrackingPopoverOpen;
  }

  ngOnInit() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  toggleTrackingPopoverVisible(): void {
    this.trackingPopoverService.toggleTrackingPopoverVisible();
  }
}
