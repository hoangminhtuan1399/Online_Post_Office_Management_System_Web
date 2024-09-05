import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";

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

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this._router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const noHeaderAndFooter = ['/admin']
        this.showHeaderAndFooter = !noHeaderAndFooter.includes(event.url);
      }
    })
  }
}
