import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { ToastService } from "./toast.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'online-post-office-management-web';
  showHeaderAndFooter: boolean = true;
  socialIcons = [
    {
      href: "https://facebook.com",
      classIcon: "fa-facebook"
    },
    {
      href: "https://instagram.com",
      classIcon: "fa-instagram"
    },
    {
      href: "https://twitter.com",
      classIcon: "fa-twitter"
    }
  ]
  toastMessage: string = '';
  toastType: 'success' | 'danger' = 'success';
  showToast: boolean = false;

  constructor(private router: Router, private toastService: ToastService) {
    // Listen for route changes to determine if header/footer should be shown
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }

  ngOnInit() {
    this.preloadBackgroundImage();
    this.toastService.toastMessage$.subscribe(message => this.toastMessage = message);
    this.toastService.toastType$.subscribe(type => this.toastType = type);
    this.toastService.showToast$.subscribe(show => this.showToast = show);
  }

  checkRoute(url: string) {
    this.showHeaderAndFooter = !url.startsWith('/admin');
  }

  preloadBackgroundImage() {
    const img = new Image();
    img.src = './assets/img/admin-background.jpg';
  }
}
