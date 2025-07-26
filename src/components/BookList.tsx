import React, { useState, useEffect } from "react";
import { bookService } from "../services/bookService";
import { Book, CreateBookRequest } from "../types/Book";
import { empruntService } from "../services/empruntService";

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [empruntsEnCours, setEmpruntsEnCours] = useState<any[]>([]);

  useEffect(() => {
    loadBooks();
    loadEmpruntsEnCours();
  }, []);

  useEffect(() => {
    let filtered = books;

    if (filterAvailable) {
      filtered = filtered.filter((book) => {
        const empruntes = empruntsEnCours.filter(
          (emprunt) => emprunt.livreId === book.id
        ).length;
        return book.nombreExemplaires - empruntes > 0;
      });
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
  }, [books, searchQuery, filterAvailable, empruntsEnCours]);

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

  const loadEmpruntsEnCours = async () => {
    try {
      const data = await empruntService.getAllEmpruntsEnCours();
      setEmpruntsEnCours(data);
    } catch (err) {
      console.error("Erreur lors du chargement des emprunts:", err);
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
    } catch (err) {
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
    } catch (err) {
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
        <div className="header-buttons">
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
            {showCreateForm
              ? "Annuler"
              : showEditForm
              ? "Nouveau livre"
              : "Nouveau livre"}
          </button>
        </div>
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

      {(showCreateForm || showEditForm) && (
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
          const empruntes = empruntsEnCours.filter(
            (emprunt) => emprunt.livreId === book.id
          ).length;
          const disponibles = book.nombreExemplaires - empruntes;
          const allEmprunted = empruntes >= book.nombreExemplaires;

          return (
            <div
              key={book.id}
              className={`book-card ${allEmprunted ? "unavailable" : ""}`}
            >
              <div className="book-header">
                <h3>{book.titre}</h3>
                <span className="status">
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      className="badge"
                      style={{
                        background: allEmprunted ? "#f8d7da" : "#d4edda",
                        color: allEmprunted ? "#721c24" : "#155724",
                        borderRadius: "8px",
                        padding: "2px 8px",
                        fontWeight: 600,
                        minWidth: "80px",
                        display: "inline-block",
                        textAlign: "center",
                      }}
                    >
                      {allEmprunted ? "EMPRUNTÉ" : "Disponible"}
                    </span>
                    {!allEmprunted && (
                      <span
                        style={{
                          background: "#f8f9fa",
                          color: "#495057",
                          borderRadius: "8px",
                          padding: "2px 8px",
                          fontWeight: 600,
                          fontSize: "12px",
                          minWidth: "40px",
                          display: "inline-block",
                          textAlign: "center",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {disponibles}/{book.nombreExemplaires}
                      </span>
                    )}
                  </div>
                </span>
              </div>
              <div className="book-details">
                <p>
                  <strong>Auteur:</strong>
                  <span>{book.auteur}</span>
                </p>
                <p>
                  <strong>Genre:</strong>
                  <span>{book.genre}</span>
                </p>
                <p>
                  <strong>ISBN:</strong>
                  <span>{book.isbn}</span>
                </p>
                <p>
                  <strong>Année:</strong>
                  <span>{book.anneePublication}</span>
                </p>
                <p>
                  <strong>Exemplaires:</strong>
                  <span>{book.nombreExemplaires}</span>
                </p>
                <p className="full-width">
                  <strong>Ajouté le:</strong>
                  <span>{new Date(book.dateAjout).toLocaleDateString()}</span>
                </p>
                {book.description && (
                  <p className="full-width description">
                    <strong>Description:</strong>
                    <span>{book.description}</span>
                  </p>
                )}
              </div>
              <div className="book-actions">
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
                >
                  <i className="fas fa-trash"></i>
                  Supprimer
                </button>
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
    </div>
  );
};

export default BookList;
