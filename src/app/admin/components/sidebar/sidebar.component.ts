import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../auth.service";


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})

export class SidebarComponent {
    isCollapsed = true;

    constructor(protected router: Router, private authService: AuthService) {}

    logout() {
        this.authService.signOut();
        this.router.navigate(['/admin/login']); // Redirect to the login page
    }

    isActive(url: string): boolean {
        return this.router.url === url;
    }
}
