import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from './core/services/auth.service';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressSpinnerModule, HeaderComponent],
  template: `
    <div class="min-h-screen">
      @if (loading) {
        <div class="min-h-screen flex items-center justify-center">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      } @else {
        @if (isAuthenticated) {
          <app-header></app-header>
        }
        <router-outlet></router-outlet>
      }
    </div>
  `,
  styles: [`
    .min-h-screen {
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0fdfa 100%);
    }
  `]
})
export class AppComponent implements OnInit {
  loading = true;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.checkAuthStatus().subscribe({
      next: (user) => {
        this.isAuthenticated = !!user;
        if (user) {
          this.redirectBasedOnRole(user.role);
        } else {
          this.router.navigate(['/login']);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  private redirectBasedOnRole(role: string) {
    const currentPath = this.router.url;
    if (currentPath === '/' || currentPath === '/login') {
      this.router.navigate([`/${role}`]);
    }
  }
}