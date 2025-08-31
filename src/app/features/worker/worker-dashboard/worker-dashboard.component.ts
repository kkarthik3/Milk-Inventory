import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MilkService } from '../../../core/services/milk.service';
import { Booking } from '../../../core/models/milk.model';

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule
  ],
  template: `
    <div class="min-h-screen p-8">
      <div class="max-w-7xl mx-auto">
        
        <!-- Route Header -->
        <mat-card class="glass-effect card-shadow p-6 mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Route A - Sector 1</h1>
              <p class="text-gray-600">Today's Delivery Schedule</p>
            </div>
            <div class="flex items-center space-x-3">
              <mat-form-field appearance="outline">
                <input matInput type="date" [(ngModel)]="selectedDate" (ngModelChange)="loadDeliveries()">
              </mat-form-field>
              <button mat-raised-button color="primary">
                <mat-icon>navigation</mat-icon>
                Navigate Route
              </button>
            </div>
          </div>
        </mat-card>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          @for (stat of stats; track stat.label) {
            <mat-card class="glass-effect card-shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">{{ stat.label }}</p>
                  <p class="text-2xl font-bold" [class]="stat.color">{{ stat.value }}</p>
                </div>
                <mat-icon [class]="stat.iconColor" class="text-3xl">{{ stat.icon }}</mat-icon>
              </div>
            </mat-card>
          }
        </div>

        <!-- Delivery List -->
        <mat-card class="p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Today's Deliveries</h2>
          
          <div class="space-y-4">
            @for (delivery of todayDeliveries; track delivery._id) {
              <mat-card class="p-6 hover-lift">
                <div class="flex items-center justify-between">
                  <div class="flex items-start space-x-4">
                    <div [class]="getMilkColor(delivery.milkType)" class="w-4 h-4 rounded-full mt-1"></div>
                    
                    <div class="flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        <h3 class="text-lg font-semibold text-gray-900">{{ delivery.customerName }}</h3>
                        @if (delivery.isExtra) {
                          <mat-chip color="accent" selected>Extra</mat-chip>
                        }
                        <mat-chip [color]="getStatusColor(delivery.status)" selected>
                          {{ delivery.status | titlecase }}
                        </mat-chip>
                      </div>
                      
                      <div class="flex items-center space-x-2 text-gray-600 mb-2">
                        <mat-icon class="text-sm">location_on</mat-icon>
                        <span class="text-sm">{{ delivery.customerAddress }}</span>
                      </div>
                      
                      <div class="text-sm text-gray-600">
                        <span class="font-medium">{{ delivery.quantity }}L {{ delivery.milkType }}</span>
                      </div>
                    </div>
                  </div>

                  @if (delivery.status === 'pending') {
                    <div class="flex items-center space-x-2">
                      <button 
                        mat-raised-button 
                        color="primary"
                        (click)="updateDeliveryStatus(delivery._id, 'delivered')"
                      >
                        <mat-icon>check_circle</mat-icon>
                        Delivered
                      </button>
                      <button 
                        mat-raised-button 
                        color="warn"
                        (click)="updateDeliveryStatus(delivery._id, 'missed')"
                      >
                        <mat-icon>cancel</mat-icon>
                        Missed
                      </button>
                    </div>
                  }
                </div>
              </mat-card>
            }

            @if (todayDeliveries.length === 0) {
              <div class="text-center py-12">
                <mat-icon class="text-gray-400 text-6xl mb-4">local_shipping</mat-icon>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Deliveries Today</h3>
                <p class="text-gray-600">Select a different date to view scheduled deliveries</p>
              </div>
            }
          </div>
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
    .bg-blue-500 { background-color: #3b82f6; }
    .bg-green-500 { background-color: #10b981; }
    .bg-orange-500 { background-color: #f97316; }
    .bg-purple-500 { background-color: #8b5cf6; }
    .bg-pink-500 { background-color: #ec4899; }
    .bg-yellow-500 { background-color: #eab308; }
  `]
})
export class WorkerDashboardComponent implements OnInit {
  selectedDate = new Date().toISOString().split('T')[0];
  deliveries: Booking[] = [];
  todayDeliveries: Booking[] = [];

  stats = [
    { label: 'Total Deliveries', value: '0', color: 'text-gray-900', icon: 'local_shipping', iconColor: 'text-blue-500' },
    { label: 'Delivered', value: '0', color: 'text-green-600', icon: 'check_circle', iconColor: 'text-green-500' },
    { label: 'Pending', value: '0', color: 'text-orange-600', icon: 'schedule', iconColor: 'text-orange-500' },
    { label: 'Missed', value: '0', color: 'text-red-600', icon: 'cancel', iconColor: 'text-red-500' }
  ];

  constructor(private milkService: MilkService) {}

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    this.milkService.getBookings().subscribe({
      next: (deliveries) => {
        this.deliveries = deliveries;
        this.updateTodayDeliveries();
        this.updateStats();
      },
      error: (error) => {
        console.error('Error loading deliveries:', error);
      }
    });
  }

  updateTodayDeliveries(): void {
    const selectedDateObj = new Date(this.selectedDate);
    this.todayDeliveries = this.deliveries.filter(delivery => 
      new Date(delivery.date).toDateString() === selectedDateObj.toDateString()
    );
  }

  updateStats(): void {
    const total = this.todayDeliveries.length;
    const delivered = this.todayDeliveries.filter(d => d.status === 'delivered').length;
    const pending = this.todayDeliveries.filter(d => d.status === 'pending').length;
    const missed = this.todayDeliveries.filter(d => d.status === 'missed').length;

    this.stats[0].value = total.toString();
    this.stats[1].value = delivered.toString();
    this.stats[2].value = pending.toString();
    this.stats[3].value = missed.toString();
  }

  getMilkColor(milkType: string): string {
    const colorMap: { [key: string]: string } = {
      'Aavin Green': 'bg-green-500',
      'Aavin Blue': 'bg-blue-500',
      'Aavin Orange': 'bg-orange-500',
      'Aavin Purple': 'bg-purple-500',
      'Aavin Pink': 'bg-pink-500',
      'Buttermilk': 'bg-yellow-500'
    };
    return colorMap[milkType] || 'bg-gray-500';
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'delivered': return 'primary';
      case 'pending': return 'accent';
      case 'missed': return 'warn';
      default: return 'primary';
    }
  }

  updateDeliveryStatus(deliveryId: string, status: 'delivered' | 'missed'): void {
    this.milkService.updateBooking(deliveryId, { status }).subscribe({
      next: () => {
        this.loadDeliveries();
      },
      error: (error) => {
        console.error('Error updating delivery status:', error);
      }
    });
  }
}