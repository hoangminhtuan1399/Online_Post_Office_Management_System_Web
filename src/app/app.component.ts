import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
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

  constructor(private router: Router) {
    // Listen for route changes to determine if header/footer should be shown
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }

  checkRoute(url: string) {
    this.showHeaderAndFooter = !url.startsWith('/admin');
  }
}
