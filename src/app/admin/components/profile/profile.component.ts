import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading: boolean = true;
  userId: string = '';
  baseUrl = environment.apiBaseUrl;
  defaultData = {
    name: '',
    email: '',
    phone: ''
  }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.userId = this.getUserId(); // Implement this method based on how you get the user's ID
    this.initForm();
    this.fetchUserData();
  }

  getUserId(): string {
    // Implement your logic to get the user ID, e.g., from a token or route param
    return '5f2a4b8c7d1f3e4a2c9b0d8f';
  }

  initForm() {
    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: false }, [Validators.required, Validators.email]],
      phone: [{ value: '', disabled: false }, Validators.required],
      name: [{ value: '', disabled: false }, Validators.required],
      dateOfBirth: [{ value: '', disabled: false }, Validators.required],
      gender: [{ value: '', disabled: true }],
      image_url: [{ value: '', disabled: true }]
    });
  }

  fetchUserData() {
    const layoutElement = document.querySelector('.admin-layout');
    layoutElement?.classList.add('loading');

    this.http.get<any>(`${this.baseUrl}/api/Employee/${this.userId}`).subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          email: data.email,
          phone: data.phone,
          name: data.name,
          dateOfBirth: new Date(data.dateOfBirth).toISOString().substring(0, 10),
          gender: data.gender,
          image_url: data.image_url
        });

        this.defaultData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
        }
      },
      error: (err) => {
        console.error('Failed to fetch user data', err);
      },
      complete: () => {
        // Remove 'loading' class
        layoutElement?.classList.remove('loading');
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const updatedData = this.profileForm.getRawValue();
    console.log('Updated Profile Data:', updatedData);
  }
}
