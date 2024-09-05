import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent {
  isCollapsed = true;

  constructor(protected router: Router) {}

  logout() {
    // Implement logout logic here
  }

  isActive(url: string): boolean {
    return this.router.url === url;
  }
}
