import api from './api';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    console.log('Attempting login with:', { email: data.email });
    const response = await api.post<AuthResponse>('/auth/login', data);
    console.log('Login successful:', { user: response.data.user, hasToken: !!response.data.token });
    return response.data;
  },

  async register(data: RegisterRequest): Promise<{ message: string }> {
    console.log('Attempting register with:', { email: data.email, name: data.name });
    const response = await api.post('/auth/register', data);
    console.log('Register successful:', response.data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    console.log('Fetching user profile...');
    const response = await api.get<User>('/auth/profile');
    console.log('Profile fetched:', response.data);
    return response.data;
  },

  logout() {
    console.log('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
