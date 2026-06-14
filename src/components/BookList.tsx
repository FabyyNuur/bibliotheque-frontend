import React, { useState, useEffect } from "react";
import { bookService } from "../services/bookService";
import { Book, CreateBookRequest } from "../types/Book";
import { empruntService } from "../services/empruntService";
import { useAuth } from "../context/AuthContext";
import BookDetailModal from "./BookDetailModal";

const BookList: React.FC = () => {
  const { isAuthenticated, isBibliothecaire } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [newBook, setNewBook] = useState<CreateBookRequest>({
    titre: "",
    auteur: "",
    isbn: "",
    anneePublication: new Date().getFullYear(),
    genre: "",
    description: "",
    nombreExemplaires: 1,
  });
  const [borrowingId, setBorrowingId] = useState<string | null>(null);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [detailBook, setDetailBook] = useState<Book | null>(null);

  const openBookDetail = (book: Book) => setDetailBook(book);
  const closeBookDetail = () => setDetailBook(null);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    setSelectedBookIds((prev) =>
      prev.filter((id) => books.some((book) => book.id === id))
    );
  }, [books]);

  useEffect(() => {
    let filtered = books;

    if (filterAvailable) {
      filtered = filtered.filter((book) => book.disponible && book.nombreExemplaires > 0);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.auteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
    setSelectedBookIds((prev) =>
      prev.filter((id) => filtered.some((book) => book.id === id))
    );
  }, [books, searchQuery, filterAvailable]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch {
      setError("Erreur lors du chargement des livres");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bookService.createBook(newBook);
      setNewBook({
        titre: "",
        auteur: "",
        isbn: "",
        anneePublication: new Date().getFullYear(),
        genre: "",
        description: "",
        nombreExemplaires: 1,
      });
      setShowCreateForm(false);
      loadBooks();
    } catch {
      setError("Erreur lors de la création du livre");
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setNewBook({
      titre: book.titre,
      auteur: book.auteur,
      isbn: book.isbn,
      anneePublication: book.anneePublication,
      genre: book.genre,
      description: book.description || "",
      nombreExemplaires: book.nombreExemplaires,
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    try {
      await bookService.updateBook(editingBook.id, {
        titre: newBook.titre,
        auteur: newBook.auteur,
        isbn: newBook.isbn,
        anneePublication: newBook.anneePublication,
        genre: newBook.genre,
        description: newBook.description,
        nombreExemplaires: newBook.nombreExemplaires,
      });
      setNewBook({
        titre: "",
        auteur: "",
        isbn: "",
        anneePublication: new Date().getFullYear(),
        genre: "",
        description: "",
        nombreExemplaires: 1,
      });
      setShowEditForm(false);
      setEditingBook(null);
      loadBooks();
    } catch {
      setError("Erreur lors de la modification du livre");
    }
  };

  const cancelEdit = () => {
    setShowEditForm(false);
    setEditingBook(null);
    setNewBook({
      titre: "",
      auteur: "",
      isbn: "",
      anneePublication: new Date().getFullYear(),
      genre: "",
      description: "",
      nombreExemplaires: 1,
    });
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
      try {
        await bookService.deleteBook(id);
        setSelectedBookIds((prev) => prev.filter((bookId) => bookId !== id));
        if (detailBook?.id === id) setDetailBook(null);
        loadBooks();
      } catch {
        setError("Erreur lors de la suppression du livre");
      }
    }
  };

  const toggleBookSelection = (id: string) => {
    setSelectedBookIds((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };

  const toggleSelectAllBooks = () => {
    const visibleIds = filteredBooks.map((book) => book.id);
    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedBookIds.includes(id));

    setSelectedBookIds((prev) =>
      allSelected
        ? prev.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...prev, ...visibleIds]))
    );
  };

  const handleBulkDeleteBooks = async () => {
    if (selectedBookIds.length === 0) return;

    const count = selectedBookIds.length;
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer ${count} livre${count > 1 ? "s" : ""} ?`
      )
    ) {
      return;
    }

    setError(null);
    setSuccess(null);

    const results = await Promise.allSettled(
      selectedBookIds.map((id) => bookService.deleteBook(id))
    );

    const failed = results.filter((result) => result.status === "rejected").length;
    const succeeded = count - failed;

    setSelectedBookIds([]);
    loadBooks();

    if (failed === 0) {
      setSuccess(`${succeeded} livre${succeeded > 1 ? "s" : ""} supprimé${succeeded > 1 ? "s" : ""}.`);
    } else if (succeeded === 0) {
      setError("Erreur lors de la suppression des livres sélectionnés.");
    } else {
      setError(
        `${succeeded} livre${succeeded > 1 ? "s" : ""} supprimé${succeeded > 1 ? "s" : ""}, ${failed} échec${failed > 1 ? "s" : ""}.`
      );
    }
  };

  const handleBorrow = async (bookId: string) => {
    setError(null);
    setSuccess(null);
    setBorrowingId(bookId);
    try {
      await empruntService.createEmprunt({ livreId: bookId });
      setSuccess("Emprunt créé avec succès !");
      setDetailBook(null);
      loadBooks();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ||
        "Impossible d'emprunter ce livre. Vous avez peut-être déjà un emprunt en cours.";
      setError(message);
    } finally {
      setBorrowingId(null);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="book-list">
      <div className="header">
        <h2>{isBibliothecaire ? "Gestion des Livres" : "Catalogue des Livres"}</h2>
        {isBibliothecaire && (
          <div className="header-buttons">
            {selectedBookIds.length > 0 && (
              <button
                className="btn danger btn-icon"
                onClick={handleBulkDeleteBooks}
                data-testid="book-bulk-delete"
              >
                <i className="fas fa-trash"></i>
                Supprimer ({selectedBookIds.length})
              </button>
            )}
            {showEditForm && (
              <button className="btn secondary btn-icon" onClick={cancelEdit}>
                <i className="fas fa-times"></i>
                Annuler modification
              </button>
            )}
            <button
              className="btn primary btn-icon"
              onClick={() => {
                if (showEditForm) {
                  cancelEdit();
                } else {
                  setShowCreateForm(!showCreateForm);
                }
              }}
            >
              <i className="fas fa-plus"></i>
              {showCreateForm ? "Annuler" : "Nouveau livre"}
            </button>
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher par titre, auteur, genre ou description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filterAvailable}
            onChange={(e) => setFilterAvailable(e.target.checked)}
          />
          Afficher uniquement les livres disponibles
        </label>
        {isBibliothecaire && filteredBooks.length > 0 && (
          <label className="filter-checkbox bulk-select-checkbox">
            <input
              type="checkbox"
              checked={
                filteredBooks.length > 0 &&
                filteredBooks.every((book) => selectedBookIds.includes(book.id))
              }
              onChange={toggleSelectAllBooks}
              data-testid="book-select-all"
            />
            Tout sélectionner ({filteredBooks.length})
          </label>
        )}
      </div>

      {isBibliothecaire && (showCreateForm || showEditForm) && (
        <form
          className="create-form"
          onSubmit={showEditForm ? handleUpdateBook : handleCreateBook}
        >
          <h3>
            {showEditForm ? "Modifier le livre" : "Ajouter un nouveau livre"}
          </h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Titre"
              value={newBook.titre}
              onChange={(e) =>
                setNewBook({ ...newBook, titre: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Auteur"
              value={newBook.auteur}
              onChange={(e) =>
                setNewBook({ ...newBook, auteur: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="ISBN"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Année de publication"
              value={newBook.anneePublication}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  anneePublication: parseInt(e.target.value),
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Genre"
              value={newBook.genre}
              onChange={(e) =>
                setNewBook({ ...newBook, genre: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Description (optionnelle)"
              value={newBook.description}
              onChange={(e) =>
                setNewBook({ ...newBook, description: e.target.value })
              }
              rows={3}
            />
            <input
              type="number"
              placeholder="Nombre d'exemplaires"
              value={newBook.nombreExemplaires}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  nombreExemplaires: parseInt(e.target.value) || 1,
                })
              }
              min="1"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn primary btn-icon">
              <i className="fas fa-save"></i>
              {showEditForm ? "Modifier" : "Ajouter"}
            </button>
            {showEditForm && (
              <button
                type="button"
                className="btn secondary btn-icon"
                onClick={cancelEdit}
              >
                <i className="fas fa-times"></i>
                Annuler
              </button>
            )}
          </div>
        </form>
      )}

      <div className="books-grid">
        {filteredBooks.map((book) => {
          const isAvailable = book.disponible && book.nombreExemplaires > 0;

          return (
            <div
              key={book.id}
              className={`book-card ${!isAvailable ? "unavailable" : ""} ${
                selectedBookIds.includes(book.id) ? "selected" : ""
              }`}
              data-testid="book-card"
            >
              {isBibliothecaire && (
                <div className="book-card-select">
                  <label className="row-select-checkbox" title="Sélectionner">
                    <input
                      type="checkbox"
                      checked={selectedBookIds.includes(book.id)}
                      onChange={() => toggleBookSelection(book.id)}
                      data-testid="book-select"
                    />
                  </label>
                </div>
              )}
              <div className="book-card-body">
                <div className="book-header">
                  <div className="book-header-main">
                    <h3>{book.titre}</h3>
                    <p className="book-card-author">{book.auteur}</p>
                  </div>
                  <div className="book-header-aside">
                    <div className="book-card-badges">
                      <span
                        className={`book-badge ${
                          isAvailable ? "book-badge-available" : "book-badge-unavailable"
                        }`}
                      >
                        {isAvailable ? "Disponible" : "Indisponible"}
                      </span>
                      {isAvailable && (
                        <span className="book-badge book-badge-stock">
                          {book.nombreExemplaires} ex.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="book-details">
                  <div className="book-meta-row">
                    <span className="book-meta-item">{book.genre}</span>
                    <span className="book-meta-sep">·</span>
                    <span className="book-meta-item">{book.anneePublication}</span>
                    <span className="book-meta-sep">·</span>
                    <span className="book-meta-item book-meta-isbn">{book.isbn}</span>
                  </div>
                  {book.description && (
                    <p className="book-card-desc" title={book.description}>
                      {book.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="book-actions">
                {isBibliothecaire && (
                  <>
                    <button
                      className="btn small secondary btn-icon"
                      onClick={() => handleEditBook(book)}
                    >
                      <i className="fas fa-edit"></i>
                      Modifier
                    </button>
                    <button
                      className="btn small danger btn-icon"
                      onClick={() => handleDeleteBook(book.id)}
                      data-testid="book-delete"
                    >
                      <i className="fas fa-trash"></i>
                      Supprimer
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="book-detail-eye-btn"
                  onClick={() => openBookDetail(book)}
                  title="Voir les détails"
                  aria-label={`Voir les détails de ${book.titre}`}
                  data-testid="book-detail-btn"
                >
                  <i className="fas fa-eye"></i>
                </button>
                {isAuthenticated && !isBibliothecaire && isAvailable && (
                  <button
                    className="btn small primary btn-icon"
                    onClick={() => handleBorrow(book.id)}
                    disabled={borrowingId === book.id}
                  >
                    <i className="fas fa-book-reader"></i>
                    {borrowingId === book.id ? "Emprunt..." : "Emprunter"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="empty-state">
          <p>Aucun livre trouvé</p>
        </div>
      )}

      <BookDetailModal
        book={detailBook}
        isOpen={detailBook !== null}
        onClose={closeBookDetail}
        isBibliothecaire={isBibliothecaire}
        isAuthenticated={isAuthenticated}
        borrowingId={borrowingId}
        onBorrow={handleBorrow}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
      />
    </div>
  );
};

export default BookList;
