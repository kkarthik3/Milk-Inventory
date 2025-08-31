export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'customer' | 'worker' | 'admin';
  phone?: string;
  address?: string;
  routeId?: string;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}