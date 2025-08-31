import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar class="glass-effect shadow-lg">
      <div class="flex items-center space-x-3">
        <div class="gradient-bg p-2 rounded-xl">
          <mat-icon class="text-white">local_drink</mat-icon>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900">MilkFlow</h1>
          <p class="text-xs text-gray-500">Delivery Management</p>
        </div>
      </div>

      <span class="flex-1"></span>

      @if (currentUser) {
        <div class="flex items-center space-x-4">
          <div [class]="getRoleClass(currentUser.role)" class="px-3 py-1 rounded-full text-xs font-medium">
            {{ currentUser.role.toUpperCase() }}
          </div>
          <div class="text-sm">
            <p class="font-medium text-gray-900">{{ currentUser.name }}</p>
            <p class="text-gray-500 text-xs">{{ currentUser.email }}</p>
          </div>
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </div>
      }
    </mat-toolbar>
  `,
  styles: [`
    .glass-effect {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(59, 130, 246, 0.1);
    }
    .gradient-bg {
      background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    }
  `]
})
export class HeaderComponent {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getRoleClass(role: string): string {
    const classes = {
      'admin': 'bg-red-100 text-red-800',
      'worker': 'bg-blue-100 text-blue-800',
      'customer': 'bg-green-100 text-green-800'
    };
    return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}