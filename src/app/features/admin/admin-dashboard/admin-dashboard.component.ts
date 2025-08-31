import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CustomerManagementComponent } from '../customer-management/customer-management.component';
import { WorkerManagementComponent } from '../worker-management/worker-management.component';
import { InventoryManagementComponent } from '../inventory-management/inventory-management.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    CustomerManagementComponent,
    WorkerManagementComponent,
    InventoryManagementComponent
  ],
  template: `
    <div class="min-h-screen p-8">
      <div class="max-w-7xl mx-auto">
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          @for (stat of stats; track stat.label) {
            <mat-card class="glass-effect card-shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">{{ stat.label }}</p>
                  <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
                  <p class="text-sm text-green-600 font-medium">{{ stat.change }}</p>
                </div>
                <div [class]="stat.color" class="w-12 h-12 rounded-xl flex items-center justify-center">
                  <mat-icon class="text-white">{{ stat.icon }}</mat-icon>
                </div>
              </div>
            </mat-card>
          }
        </div>

        <!-- Navigation Tabs -->
        <mat-card class="glass-effect card-shadow">
          <mat-tab-group class="p-4">
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">bar_chart</mat-icon>
                Overview
              </ng-template>
              <div class="p-6">
                <h2 class="text-2xl font-bold mb-6">System Overview</h2>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- Recent Orders -->
                  <mat-card class="p-6">
                    <h3 class="text-xl font-bold mb-4">Recent Orders</h3>
                    <div class="space-y-4">
                      @for (order of recentOrders; track order.id) {
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p class="font-medium">{{ order.customer }}</p>
                            <p class="text-sm text-gray-600">{{ order.quantity }} {{ order.milk }}</p>
                          </div>
                          <div class="text-right">
                            <p class="font-semibold">{{ order.amount }}</p>
                            <mat-chip [color]="order.status === 'Delivered' ? 'primary' : 'accent'" selected>
                              {{ order.status }}
                            </mat-chip>
                          </div>
                        </div>
                      }
                    </div>
                  </mat-card>

                  <!-- Top Workers -->
                  <mat-card class="p-6">
                    <h3 class="text-xl font-bold mb-4">Top Performing Workers</h3>
                    <div class="space-y-4">
                      @for (worker of topWorkers; track worker.name) {
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p class="font-medium">{{ worker.name }}</p>
                            <p class="text-sm text-gray-600">{{ worker.route }}</p>
                          </div>
                          <div class="text-right">
                            <p class="font-semibold">{{ worker.deliveries }} orders</p>
                            <p class="text-sm text-yellow-600">★ {{ worker.rating }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  </mat-card>
                </div>
              </div>
            </mat-tab>
            
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">people</mat-icon>
                Customers
              </ng-template>
              <app-customer-management></app-customer-management>
            </mat-tab>
            
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">engineering</mat-icon>
                Workers
              </ng-template>
              <app-worker-management></app-worker-management>
            </mat-tab>
            
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-2">inventory</mat-icon>
                Inventory
              </ng-template>
              <app-inventory-management></app-inventory-management>
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
export class AdminDashboardComponent implements OnInit {
  selectedDate = new Date().toISOString().split('T')[0];

  stats = [
    { label: 'Total Customers', value: '245', change: '+12%', color: 'bg-blue-500', icon: 'people' },
    { label: 'Active Workers', value: '8', change: '+2', color: 'bg-green-500', icon: 'engineering' },
    { label: 'Today Orders', value: '156', change: '+8%', color: 'bg-purple-500', icon: 'shopping_cart' },
    { label: 'Monthly Revenue', value: '₹45,230', change: '+15%', color: 'bg-orange-500', icon: 'account_balance_wallet' }
  ];

  recentOrders = [
    { id: 1, customer: 'John Doe', milk: 'Aavin Green', quantity: '2L', status: 'Delivered', amount: '₹56' },
    { id: 2, customer: 'Jane Smith', milk: 'Aavin Blue', quantity: '1L', status: 'Pending', amount: '₹26' },
    { id: 3, customer: 'Bob Wilson', milk: 'Buttermilk', quantity: '3L', status: 'Delivered', amount: '₹45' }
  ];

  topWorkers = [
    { name: 'Raj Kumar', route: 'Route A', deliveries: 45, rating: 4.9 },
    { name: 'Suresh Singh', route: 'Route B', deliveries: 42, rating: 4.8 },
    { name: 'Amit Patel', route: 'Route C', deliveries: 38, rating: 4.7 }
  ];

  ngOnInit(): void {
    // Load admin dashboard data
  }
}