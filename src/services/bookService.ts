import { apiClient } from './apiClient';
import { Book, CreateBookRequest, UpdateBookRequest } from '../types/Book';

export const bookService = {
  // Créer un livre
  async createBook(bookData: CreateBookRequest): Promise<Book> {
    const response = await apiClient.post('/books', bookData);
    return response.data;
  },

  // Récupérer tous les livres
  async getAllBooks(): Promise<Book[]> {
    const response = await apiClient.get('/books');
    return response.data;
  },

  // Récupérer les livres disponibles
  async getAvailableBooks(): Promise<Book[]> {
    const response = await apiClient.get('/books?disponible=true');
    return response.data;
  },

  // Rechercher des livres
  async searchBooks(query: string): Promise<Book[]> {
    const response = await apiClient.get(`/books?search=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Récupérer un livre par ID
  async getBookById(id: string): Promise<Book> {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },

  // Modifier un livre
  async updateBook(id: string, bookData: UpdateBookRequest): Promise<Book> {
    const response = await apiClient.put(`/books/${id}`, bookData);
    return response.data;
  },

  // Supprimer un livre
  async deleteBook(id: string): Promise<void> {
    await apiClient.delete(`/books/${id}`);
  }
};
