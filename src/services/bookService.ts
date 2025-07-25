import { apiClient } from './apiClient';
import { Book, CreateBookRequest, UpdateBookRequest } from '../types/Book';

export const bookService = {

  async createBook(bookData: CreateBookRequest): Promise<Book> {
    const response = await apiClient.post('/books', bookData);
    return response.data;
  },


  async getAllBooks(): Promise<Book[]> {
    const response = await apiClient.get('/books');
    return response.data;
  },


  async getAvailableBooks(): Promise<Book[]> {
    const response = await apiClient.get('/books?disponible=true');
    return response.data;
  },


  async searchBooks(query: string): Promise<Book[]> {
    const response = await apiClient.get(`/books?search=${encodeURIComponent(query)}`);
    return response.data;
  },


  async getBookById(id: string): Promise<Book> {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },


  async updateBook(id: string, bookData: UpdateBookRequest): Promise<Book> {
    const response = await apiClient.put(`/books/${id}`, bookData);
    return response.data;
  },


  async deleteBook(id: string): Promise<void> {
    await apiClient.delete(`/books/${id}`);
  }
};
