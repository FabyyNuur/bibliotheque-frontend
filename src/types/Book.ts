export interface Book {
  id: string;
  titre: string;
  auteur: string;
  isbn: string;
  anneePublication: number;
  genre: string;
  description?: string;
  disponible: boolean;
  dateAjout: Date;
  nombreExemplaires: number;
}

export interface CreateBookRequest {
  titre: string;
  auteur: string;
  isbn: string;
  anneePublication: number;
  genre: string;
  description?: string;
  nombreExemplaires: number;
}

export interface UpdateBookRequest {
  titre?: string;
  auteur?: string;
  isbn?: string;
  anneePublication?: number;
  genre?: string;
  description?: string;
  disponible?: boolean;
  nombreExemplaires?: number;
}
