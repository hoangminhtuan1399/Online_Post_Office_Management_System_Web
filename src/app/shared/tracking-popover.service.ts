import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TrackingPopoverService {
   isTrackingPopoverOpenSubject = new BehaviorSubject<boolean>(false);
   isTrackingPopoverOpen = this.isTrackingPopoverOpenSubject.asObservable();
  toggleTrackingPopoverVisible(): void {
    console.log('toggle')
    this.isTrackingPopoverOpenSubject.next(!this.isTrackingPopoverOpenSubject.value);
  }

  setVisibility(isVisible: boolean): void {
    this.isTrackingPopoverOpenSubject.next(isVisible);
  }
}
