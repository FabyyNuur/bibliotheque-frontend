import React from "react";
import { Book } from "../types/Book";

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  isBibliothecaire: boolean;
  isAuthenticated: boolean;
  borrowingId: string | null;
  onBorrow: (bookId: string) => void;
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
  isBibliothecaire,
  isAuthenticated,
  borrowingId,
  onBorrow,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !book) return null;

  const isAvailable = book.disponible && book.nombreExemplaires > 0;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      data-testid="book-detail-modal"
    >
      <div
        className="modal-content book-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Fermer"
          data-testid="book-detail-close"
        >
          <i className="fas fa-times"></i>
        </button>

        <h3>{book.titre}</h3>

        <div className="book-detail-body">
          <p className="book-detail-author">par {book.auteur}</p>

          <div className="book-detail-badges">
            <span
              className={`book-badge ${
                isAvailable ? "book-badge-available" : "book-badge-unavailable"
              }`}
            >
              {isAvailable ? "Disponible" : "Indisponible"}
            </span>
            {isAvailable && (
              <span className="book-badge book-badge-stock">
                {book.nombreExemplaires} exemplaire
                {book.nombreExemplaires > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <dl className="book-detail-grid">
            <div className="book-detail-item">
              <dt>Genre</dt>
              <dd>{book.genre}</dd>
            </div>
            <div className="book-detail-item">
              <dt>Année</dt>
              <dd>{book.anneePublication}</dd>
            </div>
            <div className="book-detail-item">
              <dt>ISBN</dt>
              <dd>{book.isbn}</dd>
            </div>
            <div className="book-detail-item">
              <dt>Ajouté le</dt>
              <dd>{new Date(book.dateAjout).toLocaleDateString("fr-FR")}</dd>
            </div>
          </dl>

          {book.description ? (
            <div className="book-detail-description">
              <h4>Description</h4>
              <p>{book.description}</p>
            </div>
          ) : (
            <p className="book-detail-no-desc">Aucune description disponible.</p>
          )}
        </div>

        <div className="form-actions book-detail-actions">
          <button
            type="button"
            className="btn secondary btn-icon"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
            Fermer
          </button>
          {isBibliothecaire && (
            <>
              <button
                type="button"
                className="btn secondary btn-icon"
                onClick={() => {
                  onEdit(book);
                  onClose();
                }}
              >
                <i className="fas fa-edit"></i>
                Modifier
              </button>
              <button
                type="button"
                className="btn danger btn-icon"
                onClick={() => onDelete(book.id)}
                data-testid="book-detail-delete"
              >
                <i className="fas fa-trash"></i>
                Supprimer
              </button>
            </>
          )}
          {isAuthenticated && !isBibliothecaire && isAvailable && (
            <button
              type="button"
              className="btn primary btn-icon"
              onClick={() => onBorrow(book.id)}
              disabled={borrowingId === book.id}
              data-testid="book-detail-borrow"
            >
              <i className="fas fa-book-reader"></i>
              {borrowingId === book.id ? "Emprunt..." : "Emprunter"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
