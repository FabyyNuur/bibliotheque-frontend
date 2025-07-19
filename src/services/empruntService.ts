import { apiClient } from './apiClient';
import { Emprunt, CreateEmpruntRequest, EmpruntAvecDetails } from '../types/Emprunt';

export const empruntService = {
  // Emprunter un livre
  async createEmprunt(empruntData: CreateEmpruntRequest): Promise<Emprunt> {
    const response = await apiClient.post('/emprunts', empruntData);
    return response.data;
  },

  // Retourner un livre
  async returnBook(empruntId: string): Promise<Emprunt> {
    const response = await apiClient.patch(`/emprunts/${empruntId}/retour`);
    return response.data;
  },

  // Récupérer les emprunts d'un utilisateur
  async getEmpruntsByUserId(userId: string): Promise<EmpruntAvecDetails[]> {
    const response = await apiClient.get(`/users/${userId}/emprunts`);
    return response.data;
  },

  // Récupérer tous les emprunts en cours
  async getAllEmpruntsEnCours(): Promise<EmpruntAvecDetails[]> {
    const response = await apiClient.get('/emprunts/en-cours');
    return response.data;
  },

  // Récupérer les emprunts en retard
  async getEmpruntsEnRetard(): Promise<EmpruntAvecDetails[]> {
    const response = await apiClient.get('/emprunts/en-retard');
    return response.data;
  },

  // Récupérer un emprunt par ID
  async getEmpruntById(id: string): Promise<Emprunt> {
    const response = await apiClient.get(`/emprunts/${id}`);
    return response.data;
  }
};
