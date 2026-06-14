import { apiClient } from './apiClient';
import { User, CreateUserRequest, UpdateUserRequest, CreateUserResponse } from '../types/User';

export const userService = {

  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await apiClient.post<CreateUserResponse>('/users', userData);
    return response.data;
  },


  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get('/users');
    return response.data;
  },


  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },


  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },


  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }
};
