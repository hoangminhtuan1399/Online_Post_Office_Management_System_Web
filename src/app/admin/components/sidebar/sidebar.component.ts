import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../auth.service";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent implements OnInit {
  isCollapsed = true;
  userRole: string | null = null;

  constructor(protected router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
  }

  logout() {
    localStorage.removeItem('userRole');
    this.authService.signOut();
    this.router.navigate(['/admin/login']); // Redirect to the login page
  }

  isActive(url: string): boolean {
    return this.router.url === url;
  }

  hasAdminAccess(): boolean {
    return this.userRole === 'admin';
  }
}
