import { apiClient } from './apiClient';
import { LoginRequest, LoginResponse, User, ChangePasswordRequest } from '../types/User';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<User> {
    const response = await apiClient.post<User>('/auth/change-password', data);
    return response.data;
  },
};
