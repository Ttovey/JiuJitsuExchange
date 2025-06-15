import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ],
  template: `
    <div class="register-container">
      <img src="assets/logo.png" alt="Logo" class="register-logo" />
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>{{ isGymOwner ? 'Create Gym Owner Account' : 'Create Account' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
            <mat-form-field appearance="outline" class="full-width rounded-input">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" placeholder="Choose a username">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                Username is required
              </mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width rounded-input">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="Enter your email">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Enter a valid email
              </mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width rounded-input">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Choose a password">
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width rounded-input">
              <mat-label>Confirm Password</mat-label>
              <input matInput type="password" formControlName="confirmPassword" placeholder="Confirm your password">
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Confirm password is required
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="!registerForm.valid" class="full-width">
              {{ isGymOwner ? 'Create Gym Owner Account' : 'Create Account' }}
            </button>
            <div class="toggle-link">
              <a routerLink="/login">Already have an account? Login</a>
            </div>
            <div class="toggle-link">
              <a (click)="toggleAccountType()">{{ isGymOwner ? 'Create Student Account' : 'Create Gym Owner Account' }}</a>
            </div>
          </form>
          <div *ngIf="message" class="message">{{ message }}</div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `.register-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color:rgb(116, 120, 131);
    }
    .register-logo {
      width: 100px;
      height: 100px;
      margin-bottom: 24px;
      display: block;
    }
    .register-card {
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
export class RegisterComponent {
  registerForm: FormGroup;
  message = '';
  isGymOwner = false;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private route: ActivatedRoute) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isGymOwner = params['type'] === 'gym';
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  toggleAccountType() {
    if (this.isGymOwner) {
      this.router.navigate(['/register']);
    } else {
      this.router.navigate([], { queryParams: { type: 'gym' } });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      const type = this.isGymOwner ? 'gym' : 'student';
      this.api.registerWithType(username, email, password, type).subscribe({
        next: () => {
          this.message = 'Account created! You can now log in.';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
          this.message = err.error?.message || 'Registration failed.';
        }
      });
    }
  }
} 