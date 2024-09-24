import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../../../environments/environment";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../auth.service"; 

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {
  updateForm!: FormGroup;
  loading: boolean = false;
  userId: string = '';
  baseUrl = environment.apiBaseUrl;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Chứa dữ liệu hiện tại của người dùng
  currentData: any = {};

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.userId = this.getUserId(); 
    this.initForm(); 
    this.loadUserProfile();  // Gọi hàm để lấy dữ liệu người dùng và hiển thị lên form
  }

  private initForm() {
    this.updateForm = this.fb.group({
      accountId: [''],
      employeeId: [''], 
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: [''],
      officeId: [''],
      password: [''] 
    });
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

  private loadUserProfile() {
    const headers = this.getAuthHeaders();
    
    this.http.get(`${this.baseUrl}/api/Account/${this.userId}`, { headers }).subscribe({
      next: (response: any) => {
        console.log('Profile data loaded:', response);
  
        // Lưu dữ liệu hiện tại vào biến currentData
        this.currentData = response;
  
        // Cập nhật form với dữ liệu người dùng
        this.updateForm.patchValue({
          accountId: response.accountId,
          employeeId: response.employeeId,
          name: response.name,
          email: response.email,
          phone: response.phone,
          dateOfBirth: this.formatDate(response.dateOfBirth), // Định dạng ngày sinh cho phù hợp với HTML input
          gender: response.gender,
          officeId: response.officeId
        });
  
        // Không hiển thị mật khẩu cũ trên form vì lý do bảo mật
      },
      error: (err) => {
        console.error('Failed to load profile data:', err);
        this.errorMessage = 'Failed to load profile data. Please try again.';
      }
    });
  }
  
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
  
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2); 
    const day = ('0' + date.getUTCDate()).slice(-2);          
    return `${year}-${month}-${day}`;  
  }
  
  
  onUpdate() {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const headers = this.getAuthHeaders();
    const formData = this.updateForm.getRawValue(); // Lấy dữ liệu từ form

    // So sánh dữ liệu từ form và giữ lại giá trị cũ nếu người dùng không nhập gì mới
    const updatedData = {
      accountId: formData.accountId || this.currentData.accountId,
      employeeId: formData.employeeId || this.currentData.employeeId,
      name: formData.name || this.currentData.name,
      email: formData.email || this.currentData.email,
      phone: formData.phone || this.currentData.phone,
      dateOfBirth: formData.dateOfBirth || this.currentData.dateOfBirth,
      gender: formData.gender || this.currentData.gender,
      officeId: formData.officeId || this.currentData.officeId,
      password: formData.password || ''  // Không giữ lại mật khẩu cũ, chỉ cập nhật nếu có thay đổi
    };

    // Log dữ liệu gửi lên BE để kiểm tra
    console.log('Data sent to BE:', updatedData);

    // Gửi dữ liệu cập nhật lên server
    this.http.put(`${this.baseUrl}/api/Account/${this.userId}`, updatedData, { headers }).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
        this.successMessage = 'Profile updated successfully!';
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.successMessage = null;
      }
    });
  }
}
