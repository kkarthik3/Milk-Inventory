import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MilkService } from '../../../core/services/milk.service';
import { MilkVariety, Booking } from '../../../core/models/milk.model';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';

@Component({
  selector: 'app-calendar-booking',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Milk Booking Calendar</h2>
        
        <div class="flex items-center space-x-4">
          <button mat-icon-button (click)="previousMonth()">
            <mat-icon>chevron_left</mat-icon>
          </button>
          
          <h3 class="text-lg font-semibold text-gray-800 min-w-[200px] text-center">
            {{ currentDate | date:'MMMM yyyy' }}
          </h3>
          
          <button mat-icon-button (click)="nextMonth()">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-1 mb-4">
        @for (day of weekDays; track day) {
          <div class="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
            {{ day }}
          </div>
        }
      </div>

      <div class="grid grid-cols-7 gap-1">
        @for (date of calendarDays; track date.toISOString()) {
          <div
            (click)="openBookingModal(date)"
            [class]="getDateClasses(date)"
            class="min-h-[80px] p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md"
          >
            <div class="text-sm font-medium text-gray-900 mb-1">
              {{ date.getDate() }}
            </div>
            
            @if (getBookingForDate(date); as booking) {
              <div class="space-y-1">
                <div [class]="getMilkColor(booking.milkType)" class="w-full h-2 rounded-full"></div>
                <div class="text-xs text-gray-600">
                  {{ booking.quantity }}L {{ booking.milkType.split(' ')[1] }}
                  @if (booking.isExtra) {
                    <span class="text-orange-500 font-medium"> +Extra</span>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
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
export class CalendarBookingComponent implements OnInit {
  currentDate = new Date();
  calendarDays: Date[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  bookings: Booking[] = [];
  milkVarieties: MilkVariety[] = [];

  constructor(
    private milkService: MilkService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.generateCalendar();
    this.loadBookings();
    this.loadMilkVarieties();
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    this.calendarDays = [];
    
    // Add days from previous month to fill the first week
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      this.calendarDays.push(date);
    }
  }

  loadBookings(): void {
    this.milkService.getBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
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

  getDateClasses(date: Date): string {
    const today = new Date();
    const isPast = date < today && !this.isSameDay(date, today);
    const isToday = this.isSameDay(date, today);
    const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
    
    let classes = 'bg-white hover:bg-blue-50';
    
    if (isPast) {
      classes = 'bg-gray-50 cursor-not-allowed opacity-50';
    }
    
    if (isToday) {
      classes += ' ring-2 ring-blue-500';
    }
    
    if (!isCurrentMonth) {
      classes += ' text-gray-400';
    }
    
    return classes;
  }

  getBookingForDate(date: Date): Booking | undefined {
    return this.bookings.find(booking => 
      this.isSameDay(new Date(booking.date), date)
    );
  }

  getMilkColor(milkType: string): string {
    const variety = this.milkVarieties.find(v => v.name === milkType);
    return variety?.color || 'bg-gray-300';
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  openBookingModal(date: Date): void {
    const today = new Date();
    if (date < today && !this.isSameDay(date, today)) return;

    const existingBooking = this.getBookingForDate(date);
    
    const dialogRef = this.dialog.open(BookingModalComponent, {
      width: '500px',
      data: {
        date,
        milkVarieties: this.milkVarieties,
        existingBooking
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (existingBooking) {
          // Update existing booking
          this.milkService.updateBooking(existingBooking._id, result).subscribe({
            next: () => this.loadBookings()
          });
        } else {
          // Create new booking
          this.milkService.createBooking({ ...result, date }).subscribe({
            next: () => this.loadBookings()
          });
        }
      }
    });
  }
}