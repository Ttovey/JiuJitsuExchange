import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="account-container">
      <h2>Account Information</h2>
      <div *ngIf="user">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Type:</strong> {{ user.type }}</p>
      </div>
      <div *ngIf="!user && !error">Loading...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <h3>Reset Password</h3>
      <form [formGroup]="resetForm" (ngSubmit)="onResetPassword()">
        <div class="form-row">
          <label>Old Password</label>
          <input type="password" formControlName="oldPassword" />
        </div>
        <div class="form-row">
          <label>New Password</label>
          <input type="password" formControlName="newPassword" />
        </div>
        <div class="form-row">
          <label>Confirm New Password</label>
          <input type="password" formControlName="confirmPassword" />
        </div>
        <button type="submit" [disabled]="!resetForm.valid">Reset Password</button>
      </form>
      <div *ngIf="resetMessage" class="reset-message">{{ resetMessage }}</div>
    </div>
  `,
  styles: [
    `.account-container {
      max-width: 500px;
      margin: 0 auto;
      background: #f8f8f8;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    }
    h2, h3 {
      margin-top: 0;
      color: #2a2d34;
    }
    .form-row {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }
    label {
      margin-bottom: 4px;
      color: #444;
    }
    input[type="password"] {
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #bbb;
      font-size: 1rem;
    }
    button[type="submit"] {
      background: #007bff;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 10px 24px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 8px;
      transition: background 0.2s;
    }
    button[type="submit"]:hover {
      background: #0056b3;
    }
    .error {
      color: #d32f2f;
      margin-bottom: 12px;
    }
    .reset-message {
      margin-top: 12px;
      color: #007bff;
    }
    `
  ]
})
export class ProfileAccountComponent implements OnInit {
  user: any = null;
  error: string = '';
  resetForm: FormGroup;
  resetMessage: string = '';

  constructor(private fb: FormBuilder, private api: ApiService, private http: HttpClient) {
    this.resetForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    const username = localStorage.getItem('currentUser');
    if (username) {
      this.http.get<any>(`${environment.apiUrl}/api/users/me?username=${username}`).subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load user info.';
        }
      });
    } else {
      this.error = 'No user logged in.';
    }
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onResetPassword() {
    if (this.resetForm.valid) {
      const username = localStorage.getItem('currentUser');
      const { oldPassword, newPassword } = this.resetForm.value;
      if (username) {
        this.api.changePassword(username, oldPassword, newPassword).subscribe({
          next: () => {
            this.resetMessage = 'Password changed successfully!';
            this.resetForm.reset();
          },
          error: (err) => {
            this.resetMessage = err.error?.message || 'Password change failed.';
          }
        });
      }
    }
  }
} 