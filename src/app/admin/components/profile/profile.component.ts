import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading: boolean = true;
  userId: string = '';
  baseUrl = environment.apiBaseUrl;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  defaultData = {
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    image_url: '',
    officeId: '',
    officeName: '',
    accountId: '',
    username: '',
    roleId: '',
    createdDate: ''
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.getUserId(); 
    this.fetchUserData();
  }

  private getAuthHeaders(): HttpHeaders {
    const authToken = this.authService.getTokenFromCookies();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    } else {
      console.warn('No token found in cookies');
    }

    return headers;
  }

  getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  fetchUserData() {
    const layoutElement = document.querySelector('.admin-layout');
    layoutElement?.classList.add('loading');
    const headers = this.getAuthHeaders();

    this.http.get<any>(`${this.baseUrl}/api/Account/${this.userId}`, { headers }).subscribe({
      next: (data) => {
        this.defaultData = {
          employeeId: data.employeeId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          dateOfBirth: new Date(data.dateOfBirth).toISOString().substring(0, 10),
          gender: data.gender,
          image_url: data.image_url,
          officeId: data.officeId,
          officeName: data.officeName,
          accountId: data.accountId,
          username: data.username,
          roleId: data.roleId,
          createdDate: new Date(data.createdDate).toISOString().substring(0, 10)
        };

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch user data', err);
        this.errorMessage = 'Failed to load user data. Please try again later.';
        this.loading = false;
      },
      complete: () => {
        layoutElement?.classList.remove('loading');
      }
    });
  }
}
