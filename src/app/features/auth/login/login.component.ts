import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="gradient-bg p-4 rounded-2xl mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <mat-icon class="text-white text-3xl">local_drink</mat-icon>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">MilkFlow</h1>
          <p class="text-gray-600">Sign in to your delivery dashboard</p>
        </div>

        <!-- Login Form -->
        <mat-card class="glass-effect card-shadow p-8">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="space-y-6">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Email Address</mat-label>
                <input matInput type="email" formControlName="email" placeholder="Enter your email">
                <mat-icon matSuffix>email</mat-icon>
                @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                  <mat-error>Email is required</mat-error>
                }
                @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
                  <mat-error>Please enter a valid email</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Password</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Enter your password">
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                  <mat-error>Password is required</mat-error>
                }
              </mat-form-field>

              @if (errorMessage) {
                <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p class="text-red-600 text-sm">{{ errorMessage }}</p>
                </div>
              }

              <button 
                mat-raised-button 
                type="submit" 
                class="w-full gradient-bg text-white py-3"
                [disabled]="loginForm.invalid || isLoading"
              >
                @if (isLoading) {
                  <mat-spinner diameter="20" class="mr-2"></mat-spinner>
                }
                <mat-icon class="mr-2">login</mat-icon>
                Sign In
              </button>
            </div>
          </form>
        </mat-card>

        <!-- Demo Accounts -->
        <mat-card class="glass-effect mt-6 p-4">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Demo Accounts:</h3>
          <div class="space-y-2">
            @for (account of demoAccounts; track account.role) {
              <div class="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                <span class="font-medium">{{ account.role }}:</span> {{ account.email }} / {{ account.password }}
              </div>
            }
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .min-h-screen {
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0fdfa 100%);
    }
    .gradient-bg {
      background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    }
    .glass-effect {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(59, 130, 246, 0.1);
    }
    .card-shadow {
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  demoAccounts = [
    { role: 'Admin', email: 'admin@milk.com', password: 'admin123' },
    { role: 'Worker', email: 'worker@milk.com', password: 'worker123' },
    { role: 'Customer', email: 'customer@milk.com', password: 'customer123' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.router.navigate([`/${response.user.role}`]);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Login failed';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}