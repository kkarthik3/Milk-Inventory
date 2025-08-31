import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MilkVariety, Booking, MonthlySubscription } from '../models/milk.model';

@Injectable({
  providedIn: 'root'
})
export class MilkService {
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Milk Varieties
  getMilkVarieties(): Observable<MilkVariety[]> {
    return this.http.get<MilkVariety[]>(`${this.API_URL}/milk-varieties`);
  }

  createMilkVariety(variety: Partial<MilkVariety>): Observable<MilkVariety> {
    return this.http.post<MilkVariety>(`${this.API_URL}/milk-varieties`, variety);
  }

  updateMilkVariety(id: string, variety: Partial<MilkVariety>): Observable<MilkVariety> {
    return this.http.put<MilkVariety>(`${this.API_URL}/milk-varieties/${id}`, variety);
  }

  // Bookings
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.API_URL}/bookings`);
  }

  createBooking(booking: Partial<Booking>): Observable<Booking> {
    return this.http.post<Booking>(`${this.API_URL}/bookings`, booking);
  }

  updateBooking(id: string, booking: Partial<Booking>): Observable<Booking> {
    return this.http.put<Booking>(`${this.API_URL}/bookings/${id}`, booking);
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/bookings/${id}`);
  }

  // Subscriptions
  getSubscriptions(): Observable<MonthlySubscription[]> {
    return this.http.get<MonthlySubscription[]>(`${this.API_URL}/subscriptions`);
  }

  createSubscription(subscription: Partial<MonthlySubscription>): Observable<MonthlySubscription> {
    return this.http.post<MonthlySubscription>(`${this.API_URL}/subscriptions`, subscription);
  }

  updateSubscription(id: string, subscription: Partial<MonthlySubscription>): Observable<MonthlySubscription> {
    return this.http.put<MonthlySubscription>(`${this.API_URL}/subscriptions/${id}`, subscription);
  }

  deleteSubscription(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/subscriptions/${id}`);
  }
}