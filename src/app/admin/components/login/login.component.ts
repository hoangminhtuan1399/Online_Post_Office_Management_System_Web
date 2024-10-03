import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from "../../auth.service";
import { ToastService } from "../../../toast.service";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService 
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { username, password } = this.loginForm.value;

    this.http.post<any>(`${environment.apiBaseUrl}/api/auth/login`, { username, password }).subscribe({
      next: (response) => {
        if (response && response.token) {
          console.log('res: ', response)
           this.toastService.showToast('Login successfully', 'success');
          document.cookie = `jwt=${response.token};path=/`;
          this.authService.setUserData(response);
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (errorResponse) => {
        if (errorResponse.status >= 400 && errorResponse.error) {
           this.toastService.showToast(errorResponse.error, 'danger');
        } else {
           this.toastService.showToast('An unexpected error occurred', 'danger');
        }
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
