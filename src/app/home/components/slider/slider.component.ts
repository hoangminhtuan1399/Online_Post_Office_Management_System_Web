import { Component, AfterViewInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent implements AfterViewInit {
  bannerLinks: string[] = [];

  constructor() {
    this.bannerLinks = [
      'assets/img/banner-1.jpg',
      'assets/img/banner-2.jpg',
      'assets/img/banner-3.jpg',
    ]
  }

  ngAfterViewInit(): void {
    $('.slick-slider').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      dots: true,
      arrows: false,
      cssEase: 'ease-in-out'
    });
  }
}
