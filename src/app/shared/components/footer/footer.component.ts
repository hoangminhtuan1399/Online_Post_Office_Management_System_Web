import { Component, Input } from '@angular/core';
import { TrackingPopoverService } from "../../tracking-popover.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  @Input() socialIcons!: any[];
  isTrackingPopoverVisible$: Observable<boolean>;
  constructor(private trackingPopoverService: TrackingPopoverService) {
    this.isTrackingPopoverVisible$ = trackingPopoverService.isTrackingPopoverOpen;
  }

  toggleTrackingPopoverVisible(): void {
    this.trackingPopoverService.toggleTrackingPopoverVisible();
  }
}
