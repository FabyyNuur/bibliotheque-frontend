
import { apiClient } from './apiClient';
import { Emprunt, CreateEmpruntRequest, EmpruntAvecDetails } from '../types/Emprunt';

export const empruntService = {

  async createEmprunt(empruntData: CreateEmpruntRequest): Promise<Emprunt> {
    const response = await apiClient.post('/emprunts', empruntData);
    return response.data;
  },

  

  async returnBook(empruntId: string): Promise<Emprunt> {
    const response = await apiClient.patch(`/emprunts/${empruntId}/retour`);
    return response.data;
  },


  async getEmpruntsByUserId(userId: string): Promise<EmpruntAvecDetails[]> {
    const response = await apiClient.get(`/users/${userId}/emprunts`);
    return response.data;
  },


  async getAllEmpruntsEnCours(): Promise<EmpruntAvecDetails[]> {
    const response = await apiClient.get('/emprunts/en-cours');
    return response.data;
  },


  async getEmpruntsEnRetard(): Promise<EmpruntAvecDetails[]> {
    const response = await apiClient.get('/emprunts/en-retard');
    return response.data;
  },


  async getEmpruntById(id: string): Promise<Emprunt> {
    const response = await apiClient.get(`/emprunts/${id}`);
    return response.data;
  },

  async getEmpruntsHistorique(): Promise<EmpruntAvecDetails[]> {
    const response = await apiClient.get('/emprunts/historique');
    return response.data;
  }
};
