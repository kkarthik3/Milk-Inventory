import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MilkService } from '../../../core/services/milk.service';
import { MonthlySubscription, MilkVariety } from '../../../core/models/milk.model';

@Component({
  selector: 'app-subscription-manager',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Monthly Subscriptions</h2>
        <button mat-raised-button color="primary" (click)="createSubscription()">
          <mat-icon>add</mat-icon>
          New Subscription
        </button>
      </div>

      <div class="space-y-4">
        @for (subscription of subscriptions; track subscription._id) {
          <mat-card class="p-6 hover-lift">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div [class]="getMilkColor(subscription.milkType)" class="w-4 h-4 rounded-full"></div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ subscription.milkType }} - {{ subscription.quantity }}L Daily
                  </h3>
                  <p class="text-sm text-gray-600">
                    Monthly Cost: ₹{{ getMonthlyPrice(subscription) }} | 
                    Active until {{ subscription.endDate | date:'MMM dd, yyyy' }}
                  </p>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <mat-chip [color]="subscription.isActive ? 'primary' : 'warn'" selected>
                  {{ subscription.isActive ? 'Active' : 'Paused' }}
                </mat-chip>

                <button mat-icon-button (click)="toggleSubscription(subscription)">
                  <mat-icon>{{ subscription.isActive ? 'pause' : 'play_arrow' }}</mat-icon>
                </button>

                <button mat-icon-button color="primary">
                  <mat-icon>edit</mat-icon>
                </button>

                <button mat-icon-button color="warn" (click)="deleteSubscription(subscription._id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>

            @if (subscription.pausedDates.length > 0) {
              <div class="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p class="text-sm text-yellow-800">
                  Paused on {{ subscription.pausedDates.length }} days this month
                </p>
              </div>
            }
          </mat-card>
        }

        @if (subscriptions.length === 0) {
          <div class="text-center py-12">
            <mat-icon class="text-gray-400 text-6xl mb-4">calendar_today</mat-icon>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No Active Subscriptions</h3>
            <p class="text-gray-600">Create a monthly subscription to ensure regular milk delivery</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
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
export class SubscriptionManagerComponent implements OnInit {
  subscriptions: MonthlySubscription[] = [];
  milkVarieties: MilkVariety[] = [];

  constructor(private milkService: MilkService) {}

  ngOnInit(): void {
    this.loadSubscriptions();
    this.loadMilkVarieties();
  }

  loadSubscriptions(): void {
    this.milkService.getSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
      },
      error: (error) => {
        console.error('Error loading subscriptions:', error);
      }
    });
  }

  loadMilkVarieties(): void {
    this.milkService.getMilkVarieties().subscribe({
      next: (varieties) => {
        this.milkVarieties = varieties;
      },
      error: (error) => {
        console.error('Error loading milk varieties:', error);
      }
    });
  }

  getMilkColor(milkType: string): string {
    const variety = this.milkVarieties.find(v => v.name === milkType);
    return variety?.color || 'bg-gray-300';
  }

  getMonthlyPrice(subscription: MonthlySubscription): number {
    const variety = this.milkVarieties.find(v => v.name === subscription.milkType);
    return (variety?.pricePerLiter || 0) * subscription.quantity * 30;
  }

  toggleSubscription(subscription: MonthlySubscription): void {
    const updatedSubscription = { ...subscription, isActive: !subscription.isActive };
    this.milkService.updateSubscription(subscription._id, updatedSubscription).subscribe({
      next: () => this.loadSubscriptions()
    });
  }

  deleteSubscription(subscriptionId: string): void {
    if (confirm('Are you sure you want to delete this subscription?')) {
      this.milkService.deleteSubscription(subscriptionId).subscribe({
        next: () => this.loadSubscriptions()
      });
    }
  }

  createSubscription(): void {
    // Open create subscription modal
    console.log('Create subscription modal');
  }
}