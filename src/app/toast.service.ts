import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastMessageSource = new BehaviorSubject<string>('');
  private toastTypeSource = new BehaviorSubject<'success' | 'danger'>('success');
  private showToastSource = new BehaviorSubject<boolean>(false);
  private toastDuration = 3000;

  toastMessage$ = this.toastMessageSource.asObservable();
  toastType$ = this.toastTypeSource.asObservable();
  showToast$ = this.showToastSource.asObservable();

  constructor() {}

  showToast(message: string, type: 'success' | 'danger') {
    this.toastMessageSource.next(message);
    this.toastTypeSource.next(type);
    this.showToastSource.next(true);

    setTimeout(() => {
      this.hideToast();
    }, this.toastDuration);
  }

  hideToast() {
    this.showToastSource.next(false);
  }
}
