import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PackageDetail } from './package-detail.model';

@Injectable({
  providedIn: 'root'
})
export class PackageDetailService {
  private isDetailVisibleSubject = new BehaviorSubject<boolean>(false);
  isDetailVisible$ = this.isDetailVisibleSubject.asObservable();

  private packageDetailSubject = new BehaviorSubject<PackageDetail | null>(null);
  packageDetail$ = this.packageDetailSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false); // Trạng thái loading
  isLoading$ = this.isLoadingSubject.asObservable();

  toggleDetailVisible(): void {
    this.isDetailVisibleSubject.next(!this.isDetailVisibleSubject.value);
  }

  setPackageDetail(detail: PackageDetail | null): void {
    this.packageDetailSubject.next(detail);
    this.setLoadingState(false); // Dừng loading khi có kết quả
  }

  setVisibility(isVisible: boolean): void {
    this.isDetailVisibleSubject.next(isVisible);
  }

  setLoadingState(isLoading: boolean): void {
    this.isLoadingSubject.next(isLoading); // Cập nhật trạng thái loading
  }
}
