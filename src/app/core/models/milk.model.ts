export interface MilkVariety {
  _id: string;
  name: string;
  color: string;
  pricePerLiter: number;
  stock: number;
  description: string;
}

export interface Booking {
  _id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  date: Date;
  milkType: string;
  quantity: number;
  isExtra: boolean;
  status: 'pending' | 'delivered' | 'missed' | 'cancelled';
  routeId: string;
  workerId?: string;
  createdAt: Date;
}

export interface MonthlySubscription {
  _id: string;
  customerId: string;
  milkType: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  pausedDates: Date[];
}

export interface Route {
  _id: string;
  name: string;
  workerId: string;
  workerName: string;
  areas: string[];
  customerCount: number;
}