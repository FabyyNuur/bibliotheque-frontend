import React, { useState, useEffect } from "react";
import { bookService } from "../services/bookService";
import { Book, CreateBookRequest } from "../types/Book";

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [newBook, setNewBook] = useState<CreateBookRequest>({
    titre: "",
    auteur: "",
    isbn: "",
    anneePublication: new Date().getFullYear(),
    genre: "",
  });

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, filterAvailable]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      setError("Erreur lors du chargement des livres");
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    if (filterAvailable) {
      filtered = filtered.filter((book) => book.disponible);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.auteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
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
      });
      setShowCreateForm(false);
      loadBooks();
    } catch (err) {
      setError("Erreur lors de la création du livre");
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
      try {
        await bookService.deleteBook(id);
        loadBooks();
      } catch (err) {
        setError("Erreur lors de la suppression du livre");
      }
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="book-list">
      <div className="header">
        <h2>Gestion des Livres</h2>
        <button
          className="btn primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Annuler" : "➕ Nouveau livre"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher par titre, auteur ou genre..."
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
      </div>

      {showCreateForm && (
        <form className="create-form" onSubmit={handleCreateBook}>
          <h3>Ajouter un nouveau livre</h3>
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
          </div>
          <button type="submit" className="btn primary">
            Ajouter
          </button>
        </form>
      )}

      <div className="books-grid">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className={`book-card ${!book.disponible ? "unavailable" : ""}`}
          >
            <div className="book-header">
              <h3>{book.titre}</h3>
              <span
                className={`availability ${
                  book.disponible ? "available" : "borrowed"
                }`}
              >
                {book.disponible ? "✅ Disponible" : "📚 Emprunté"}
              </span>
            </div>
            <div className="book-details">
              <p>
                <strong>Auteur:</strong> {book.auteur}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre}
              </p>
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>
              <p>
                <strong>Année:</strong> {book.anneePublication}
              </p>
              <p>
                <strong>Ajouté le:</strong>{" "}
                {new Date(book.dateAjout).toLocaleDateString()}
              </p>
            </div>
            <div className="book-actions">
              <button
                className="btn small danger"
                onClick={() => handleDeleteBook(book.id)}
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="empty-state">
          <p>Aucun livre trouvé</p>
        </div>
      )}
    </div>
  );
};

export default BookList;
