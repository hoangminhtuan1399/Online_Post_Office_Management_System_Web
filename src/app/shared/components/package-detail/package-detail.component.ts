import { Component, OnInit } from '@angular/core';
import { PackageDetailService } from '../../package-detail.service';

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css'
})
export class PackageDetailComponent implements OnInit {
  packageDetail: any | null = null;
  isVisible: boolean = false;
  isLoading: boolean = false;  // Trạng thái loading
  errorMessage: string | null = null;

  constructor(private packageDetailService: PackageDetailService) { }

  ngOnInit(): void {
    this.packageDetailService.packageDetail$.subscribe(detail => {
      this.packageDetail = detail;
      this.errorMessage = detail ? null : 'Cannot find your package';
      this.isVisible = true;
    });

    this.packageDetailService.isDetailVisible$.subscribe(isVisible => {
      this.isVisible = isVisible;
    });

    this.packageDetailService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  closeDetail() {
    this.packageDetailService.setVisibility(false);
  }
}
