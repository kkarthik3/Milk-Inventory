import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MilkVariety, Booking } from '../../../core/models/milk.model';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 mat-dialog-title class="text-lg font-semibold">
          {{ data.existingBooking ? 'Edit' : 'Book' }} Milk for {{ data.date | date:'MMM dd, yyyy' }}
        </h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
        <div class="space-y-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Milk Variety</mat-label>
            <mat-select formControlName="milkType">
              @for (variety of data.milkVarieties; track variety._id) {
                <mat-option [value]="variety.name">
                  <div class="flex items-center space-x-2">
                    <div [class]="variety.color" class="w-3 h-3 rounded-full"></div>
                    <span>{{ variety.name }} - ₹{{ variety.pricePerLiter }}/L</span>
                  </div>
                </mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Quantity (Liters)</mat-label>
            <input matInput type="number" formControlName="quantity" min="1">
          </mat-form-field>

          <div class="flex items-center">
            <mat-checkbox formControlName="isExtra">
              Extra milk for today
            </mat-checkbox>
          </div>

          <div class="bg-blue-50 p-4 rounded-xl">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Price:</span>
              <span class="text-lg font-bold text-blue-600">₹{{ getTotalPrice() }}</span>
            </div>
          </div>
        </div>

        <div mat-dialog-actions class="flex space-x-3 mt-6">
          @if (data.existingBooking) {
            <button mat-raised-button color="warn" type="button" (click)="deleteBooking()">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          }
          <button mat-button type="button" (click)="close()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="bookingForm.invalid">
            <mat-icon>{{ data.existingBooking ? 'edit' : 'add' }}</mat-icon>
            {{ data.existingBooking ? 'Update' : 'Book' }} Milk
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .bg-blue-500 { background-color: #3b82f6; }
    .bg-green-500 { background-color: #10b981; }
    .bg-orange-500 { background-color: #f97316; }
    .bg-purple-500 { background-color: #8b5cf6; }
    .bg-pink-500 { background-color: #ec4899; }
    .bg-yellow-500 { background-color: #eab308; }
  `]
})
export class BookingModalComponent {
  bookingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BookingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      date: Date;
      milkVarieties: MilkVariety[];
      existingBooking: Booking | null;
    }
  ) {
    this.bookingForm = this.fb.group({
      milkType: [data.existingBooking?.milkType || data.milkVarieties[0]?.name, Validators.required],
      quantity: [data.existingBooking?.quantity || 1, [Validators.required, Validators.min(1)]],
      isExtra: [data.existingBooking?.isExtra || false]
    });
  }

  getTotalPrice(): number {
    const milkType = this.bookingForm.get('milkType')?.value;
    const quantity = this.bookingForm.get('quantity')?.value || 0;
    const variety = this.data.milkVarieties.find(v => v.name === milkType);
    return (variety?.pricePerLiter || 0) * quantity;
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.dialogRef.close(this.bookingForm.value);
    }
  }

  deleteBooking(): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.dialogRef.close({ delete: true });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}