import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { User, Route } from '../../../core/models/milk.model';

@Component({
  selector: 'app-worker-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <div class="p-6 space-y-8">
      <!-- Workers Section -->
      <mat-card class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Worker Management</h2>
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            Add Worker
          </button>
        </div>

        <table mat-table [dataSource]="workers" class="w-full">
          <ng-container matColumnDef="worker">
            <th mat-header-cell *matHeaderCellDef>Worker</th>
            <td mat-cell *matCellDef="let worker">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <mat-icon class="text-white">person</mat-icon>
                </div>
                <div>
                  <p class="font-semibold">{{ worker.name }}</p>
                  <p class="text-sm text-gray-600">{{ worker.email }}</p>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="contact">
            <th mat-header-cell *matHeaderCellDef>Contact</th>
            <td mat-cell *matCellDef="let worker">{{ worker.phone }}</td>
          </ng-container>

          <ng-container matColumnDef="route">
            <th mat-header-cell *matHeaderCellDef>Assigned Route</th>
            <td mat-cell *matCellDef="let worker">
              @if (getWorkerRoute(worker.routeId); as route) {
                <div>
                  <p class="font-medium">{{ route.name }}</p>
                  <p class="text-sm text-gray-600">{{ route.customerCount }} customers</p>
                </div>
              } @else {
                <span class="text-gray-400">No route assigned</span>
              }
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let worker">
              <button mat-icon-button color="accent">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteWorker(worker._id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="workerColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: workerColumns;"></tr>
        </table>
      </mat-card>

      <!-- Routes Section -->
      <mat-card class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Delivery Routes</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (route of routes; track route._id) {
            <mat-card class="p-6 hover-lift">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold">{{ route.name }}</h3>
                <mat-icon class="text-blue-500">location_on</mat-icon>
              </div>

              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600">Assigned Worker:</p>
                  <p class="font-medium">{{ route.workerName || 'Unassigned' }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-600">Areas:</p>
                  <div class="flex flex-wrap gap-1 mt-1">
                    @for (area of route.areas; track area) {
                      <mat-chip>{{ area }}</mat-chip>
                    }
                  </div>
                </div>

                <div>
                  <p class="text-sm text-gray-600">Customers:</p>
                  <p class="font-semibold text-blue-600">{{ route.customerCount }}</p>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t">
                <button mat-button color="primary">Manage Route</button>
              </div>
            </mat-card>
          }
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .hover-lift {
      transition: transform 0.2s ease-in-out;
    }
    .hover-lift:hover {
      transform: translateY(-2px);
    }
  `]
})
export class WorkerManagementComponent implements OnInit {
  workers: User[] = [];
  routes: Route[] = [];
  workerColumns = ['worker', 'contact', 'route', 'actions'];

  ngOnInit(): void {
    this.loadWorkers();
    this.loadRoutes();
  }

  loadWorkers(): void {
    // Load workers from API
    this.workers = [
      {
        _id: '1',
        email: 'raj@milkdelivery.com',
        name: 'Raj Kumar',
        role: 'worker',
        phone: '+91 9876543210',
        routeId: 'route1',
        createdAt: new Date('2024-01-10')
      }
    ];
  }

  loadRoutes(): void {
    this.routes = [
      { _id: 'route1', name: 'Route A - Sector 1', workerId: '1', workerName: 'Raj Kumar', areas: ['Anna Nagar', 'T. Nagar'], customerCount: 45 },
      { _id: 'route2', name: 'Route B - Sector 2', workerId: '2', workerName: 'Suresh Singh', areas: ['Adyar', 'Velachery'], customerCount: 38 }
    ];
  }

  getWorkerRoute(routeId?: string): Route | undefined {
    return this.routes.find(route => route._id === routeId);
  }

  deleteWorker(workerId: string): void {
    if (confirm('Are you sure you want to delete this worker?')) {
      this.workers = this.workers.filter(w => w._id !== workerId);
    }
  }
}