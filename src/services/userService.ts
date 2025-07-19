import { apiClient } from './apiClient';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/User';

export const userService = {
  // Créer un utilisateur
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get('/users');
    return response.data;
  },

  // Récupérer un utilisateur par ID
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Modifier un utilisateur
  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Supprimer un utilisateur
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }
};
