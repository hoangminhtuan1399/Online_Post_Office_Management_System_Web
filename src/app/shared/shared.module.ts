import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { RouterLink } from "@angular/router";
import { TrackDeliveryPopoverComponent } from "./components/track-delivery-popover/track-delivery-popover.component";
import { ReactiveFormsModule } from "@angular/forms";
import { PackageDetailComponent } from './components/package-detail/package-detail.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    TrackDeliveryPopoverComponent,
    PackageDetailComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
