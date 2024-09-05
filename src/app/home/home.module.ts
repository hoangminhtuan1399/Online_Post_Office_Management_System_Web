import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { CommonModule } from "@angular/common";
import { SliderComponent } from './components/slider/slider.component';

@NgModule({
  declarations: [
    HomeComponent,
    SliderComponent
  ],
  imports: [
    CommonModule
  ]
})

export class HomeModule {
}
