import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Customer Management</h2>
        <div class="flex items-center space-x-3">
          <button mat-raised-button color="accent">
            <mat-icon>download</mat-icon>
            Export
          </button>
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            Add Customer
          </button>
        </div>
      </div>

      <div class="mb-6">
        <mat-form-field appearance="outline" class="w-full max-w-md">
          <mat-label>Search customers...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterCustomers()">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <mat-card>
        <table mat-table [dataSource]="filteredCustomers" class="w-full">
          <ng-container matColumnDef="customer">
            <th mat-header-cell *matHeaderCellDef>Customer</th>
            <td mat-cell *matCellDef="let customer">
              <div>
                <p class="font-semibold">{{ customer.name }}</p>
                <p class="text-sm text-gray-600">{{ customer.email }}</p>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="contact">
            <th mat-header-cell *matHeaderCellDef>Contact</th>
            <td mat-cell *matCellDef="let customer">{{ customer.phone }}</td>
          </ng-container>

          <ng-container matColumnDef="address">
            <th mat-header-cell *matHeaderCellDef>Address</th>
            <td mat-cell *matCellDef="let customer">{{ customer.address }}</td>
          </ng-container>

          <ng-container matColumnDef="joined">
            <th mat-header-cell *matHeaderCellDef>Joined</th>
            <td mat-cell *matCellDef="let customer">{{ customer.createdAt | date:'MMM dd, yyyy' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let customer">
              <button mat-icon-button color="primary">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="accent">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteCustomer(customer._id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `
})
export class CustomerManagementComponent implements OnInit {
  customers: User[] = [];
  filteredCustomers: User[] = [];
  searchTerm = '';
  displayedColumns = ['customer', 'contact', 'address', 'joined', 'actions'];

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    // Load customers from API
    this.customers = [
      {
        _id: '1',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'customer',
        phone: '+91 9876543210',
        address: '123 Main Street, Chennai',
        createdAt: new Date('2024-01-15')
      }
    ];
    this.filteredCustomers = [...this.customers];
  }

  filterCustomers(): void {
    this.filteredCustomers = this.customers.filter(customer =>
      customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.phone?.includes(this.searchTerm)
    );
  }

  deleteCustomer(customerId: string): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customers = this.customers.filter(c => c._id !== customerId);
      this.filterCustomers();
    }
  }
}