import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <img src="assets/logo.png" alt="Logo" class="login-logo" />
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
            <mat-form-field appearance="outline" class="full-width rounded-input">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" placeholder="Enter your username">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                Username is required
              </mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width rounded-input">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Enter your password">
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="!loginForm.valid" class="full-width">
              Login
            </button>
            <div class="toggle-link">
              <a (click)="goToRegister()">Don't have an account? Create one</a>
            </div>
          </form>
          <div *ngIf="message" class="message">{{ message }}</div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color:rgb(116, 120, 131);
    }
    .login-logo {
      width: 100px;
      height: 100px;
      margin-bottom: 24px;
      display: block;
    }
    .login-card {
      max-width: 400px;
      width: 90%;
      padding: 20px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .rounded-input .mat-mdc-form-field-outline {
      border-radius: 24px !important;
    }
    .rounded-input .mat-mdc-text-field-wrapper {
      border-radius: 24px !important;
    }
    mat-card-header {
      margin-bottom: 20px;
    }
    mat-card-title {
      font-size: 24px;
    }
    .toggle-link {
      margin-top: 10px;
      text-align: center;
    }
    .toggle-link a {
      color: #007bff;
      cursor: pointer;
      text-decoration: underline;
    }
    .message {
      margin-top: 16px;
      text-align: center;
      color: #d32f2f;
      font-weight: 500;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.api.login(username, password).subscribe({
        next: () => {
          localStorage.setItem('currentUser', username); // Store username
          this.router.navigate(['/']); // Redirect to landing page
        },
        error: (err) => {
          this.message = err.error?.message || 'Login failed.';
        }
      });
    }
  }
}