import { Component, OnInit } from '@angular/core';
import { PackageService } from './package.service';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrl: './package.component.css'
})
export class PackageComponent implements OnInit {
  packages: any[] = [];

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    this.packageService.getPackageData().subscribe(
      (data) => {
        this.packages = data;
      },
      (error) => {
        console.error('Error fetching package data', error);
      }
    );
  }
}

