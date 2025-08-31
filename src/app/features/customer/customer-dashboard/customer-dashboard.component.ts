import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CalendarBookingComponent } from '../calendar-booking/calendar-booking.component';
import { SubscriptionManagerComponent } from '../subscription-manager/subscription-manager.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    CalendarBookingComponent,
    SubscriptionManagerComponent
  ],
  template: `
    <div class="min-h-screen p-8">
      <div class="max-w-7xl mx-auto">
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          @for (stat of stats; track stat.label) {
            <mat-card class="glass-effect card-shadow p-6 hover-lift">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">{{ stat.label }}</p>
                  <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
                </div>
                <div [class]="stat.color" class="w-12 h-12 rounded-xl flex items-center justify-center">
                  <mat-icon class="text-white">{{ stat.icon }}</mat-icon>
                </div>
              </div>
            </mat-card>
          }
        </div>

        <!-- Navigation Tabs -->
        <mat-card class="glass-effect card-shadow mb-8">
          <mat-tab-group [(selectedIndex)]="selectedTabIndex" class="p-4">
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">calendar_today</mat-icon>
                Book Milk
              </ng-template>
              <app-calendar-booking></app-calendar-booking>
            </mat-tab>
            
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">subscriptions</mat-icon>
                Subscriptions
              </ng-template>
              <app-subscription-manager></app-subscription-manager>
            </mat-tab>
            
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">payment</mat-icon>
                Billing
              </ng-template>
              <div class="p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Billing History</h2>
                <div class="space-y-4">
                  @for (bill of billingHistory; track bill.id) {
                    <div class="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p class="font-medium">{{ bill.month }}</p>
                        <p class="text-sm text-gray-600">{{ bill.date }}</p>
                      </div>
                      <div class="text-right">
                        <p class="font-bold">₹{{ bill.amount }}</p>
                        <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">{{ bill.status }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </mat-tab>
            
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">person</mat-icon>
                Profile
              </ng-template>
              <div class="p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                <p class="text-gray-600">Profile management coming soon...</p>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .glass-effect {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(59, 130, 246, 0.1);
    }
    .card-shadow {
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .hover-lift {
      transition: transform 0.2s ease-in-out;
    }
    .hover-lift:hover {
      transform: translateY(-2px);
    }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  selectedTabIndex = 0;

  stats = [
    { label: 'This Month Orders', value: '24', color: 'bg-blue-500', icon: 'shopping_cart' },
    { label: 'Total Spent', value: '₹672', color: 'bg-green-500', icon: 'account_balance_wallet' },
    { label: 'Active Subscriptions', value: '2', color: 'bg-purple-500', icon: 'subscriptions' },
    { label: 'Next Delivery', value: 'Tomorrow', color: 'bg-orange-500', icon: 'local_shipping' }
  ];

  billingHistory = [
    { id: 1, month: 'November 2024', amount: 672, status: 'Paid', date: '2024-11-01' },
    { id: 2, month: 'October 2024', amount: 680, status: 'Paid', date: '2024-10-01' },
    { id: 3, month: 'September 2024', amount: 650, status: 'Paid', date: '2024-09-01' }
  ];

  ngOnInit(): void {
    // Initialize component
  }
}