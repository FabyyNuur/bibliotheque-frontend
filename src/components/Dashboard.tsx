import React, { useState, useEffect } from "react";
import { userService } from "../services/userService";
import { bookService } from "../services/bookService";
import { empruntService } from "../services/empruntService";

interface DashboardStats {
  totalUsers: number;
  totalBooks: number;
  availableBooks: number;
  currentLoans: number;
  overdueLoans: number;
}

interface ModalState {
  type: "book" | "user" | "emprunt" | null;
  isOpen: boolean;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBooks: 0,
    availableBooks: 0,
    currentLoans: 0,
    overdueLoans: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: null, isOpen: false });

  // États pour les formulaires
  const [bookForm, setBookForm] = useState({
    titre: "",
    auteur: "",
    isbn: "",
    anneePublication: new Date().getFullYear(),
    genre: "",
    description: "",
    nombreExemplaires: 1,
  });
  const [userForm, setUserForm] = useState({ nom: "", prenom: "", email: "" });
  const [empruntForm, setEmpruntForm] = useState({
    utilisateurId: "",
    livreId: "",
  });
  const [users, setUsers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [empruntsEnCours, setEmpruntsEnCours] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    loadUsersAndBooks();
  }, []);

  const loadUsersAndBooks = async () => {
    try {
      const [usersData, booksData, allBooksData, empruntsData] =
        await Promise.all([
          userService.getAllUsers(),
          bookService.getAvailableBooks(),
          bookService.getAllBooks(),
          empruntService.getAllEmpruntsEnCours(),
        ]);
      setUsers(usersData);
      setBooks(booksData);
      setEmpruntsEnCours(empruntsData);
      // Prendre les 5 livres les plus récents
      const sortedBooks = allBooksData
        .sort(
          (a: any, b: any) =>
            new Date(b.dateAjout).getTime() - new Date(a.dateAjout).getTime()
        )
        .slice(0, 5);
      setRecentBooks(sortedBooks);
    } catch (err) {
      console.error(
        "Erreur lors du chargement des utilisateurs et livres:",
        err
      );
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [users, books, availableBooks, currentLoans, overdueLoans] =
        await Promise.all([
          userService.getAllUsers(),
          bookService.getAllBooks(),
          bookService.getAvailableBooks(),
          empruntService.getAllEmpruntsEnCours(),
          empruntService.getEmpruntsEnRetard(),
        ]);

      setStats({
        totalUsers: users.length,
        totalBooks: books.length,
        availableBooks: availableBooks.length,
        currentLoans: currentLoans.length,
        overdueLoans: overdueLoans.length,
      });
    } catch (err) {
      setError("Erreur lors du chargement des données du dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour ouvrir les modals
  const openModal = (type: "book" | "user" | "emprunt") => {
    setModal({ type, isOpen: true });
  };

  const closeModal = () => {
    setModal({ type: null, isOpen: false });
    // Reset des formulaires
    setBookForm({
      titre: "",
      auteur: "",
      isbn: "",
      anneePublication: new Date().getFullYear(),
      genre: "",
      description: "",
      nombreExemplaires: 1,
    });
    setUserForm({ nom: "", prenom: "", email: "" });
    setEmpruntForm({ utilisateurId: "", livreId: "" });
  };

  // Fonctions de soumission des formulaires
  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bookService.createBook({
        titre: bookForm.titre,
        auteur: bookForm.auteur,
        isbn: bookForm.isbn,
        anneePublication: bookForm.anneePublication,
        genre: bookForm.genre,
        description: bookForm.description,
        nombreExemplaires: bookForm.nombreExemplaires,
      });
      closeModal();
      loadDashboardData();
      loadUsersAndBooks();
      alert("Livre créé avec succès!");
    } catch (err) {
      alert("Erreur lors de la création du livre");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.createUser({
        nom: userForm.nom,
        prenom: userForm.prenom,
        email: userForm.email,
      });
      closeModal();
      loadDashboardData();
      loadUsersAndBooks();
      alert("Utilisateur créé avec succès!");
    } catch (err) {
      alert("Erreur lors de la création de l'utilisateur");
    }
  };

  const handleCreateEmprunt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await empruntService.createEmprunt({
        utilisateurId: empruntForm.utilisateurId,
        livreId: empruntForm.livreId,
      });
      closeModal();
      loadDashboardData();
      loadUsersAndBooks();
      alert("Emprunt créé avec succès!");
    } catch (err) {
      alert("Erreur lors de la création de l'emprunt");
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h2>Dashboard - Vue d'ensemble</h2>

      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>Utilisateurs</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card books">
          <div className="stat-icon">
            <i className="fas fa-book"></i>
          </div>
          <div className="stat-content">
            <h3>Total Livres</h3>
            <p className="stat-number">{stats.totalBooks}</p>
          </div>
        </div>

        <div className="stat-card available">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>Livres Disponibles</h3>
            <p className="stat-number">{stats.availableBooks}</p>
          </div>
        </div>

        <div className="stat-card loans">
          <div className="stat-icon">
            <i className="fas fa-book-open"></i>
          </div>
          <div className="stat-content">
            <h3>Emprunts en cours</h3>
            <p className="stat-number">{stats.currentLoans}</p>
          </div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>Emprunts en retard</h3>
            <p className="stat-number">{stats.overdueLoans}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h3>Actions rapides</h3>
        <div className="action-buttons">
          <button
            className="action-btn primary btn-icon"
            onClick={() => openModal("book")}
          >
            <i className="fas fa-plus"></i>
            Ajouter un livre
          </button>
          <button
            className="action-btn tertiary btn-icon"
            onClick={() => openModal("user")}
          >
            <i className="fas fa-user-plus"></i>
            Nouveau utilisateur
          </button>
          <button
            className="action-btn tertiary btn-icon"
            onClick={() => openModal("emprunt")}
          >
            <i className="fas fa-clipboard-list"></i>
            Nouvel emprunt
          </button>
        </div>
      </div>

      <div className="books-overview">
        <h3>
          <i className="fas fa-book" style={{ marginRight: "10px" }}></i>
          Aperçu des livres récents
        </h3>
        <div className="books-grid">
          {recentBooks.length > 0 ? (
            recentBooks.map((book: any) => {
              const empruntes = empruntsEnCours.filter(
                (emprunt) => emprunt.livreId === book.id
              ).length;
              const disponibles = book.nombreExemplaires - empruntes;
              const allEmprunted = empruntes >= book.nombreExemplaires;

              return (
                <div key={book.id} className="book-card">
                  <div className="book-info">
                    <h4 className="book-title">{book.titre}</h4>
                    <p className="book-author">par {book.auteur}</p>
                    <p className="book-genre">{book.genre}</p>
                    <div className="book-details">
                      <span className="book-year">{book.anneePublication}</span>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="book-status"
                          style={{
                            background: allEmprunted ? "#f8d7da" : "#d4edda",
                            color: allEmprunted ? "#721c24" : "#155724",
                            borderRadius: "8px",
                            padding: "2px 8px",
                            fontWeight: 600,
                            fontSize: "12px",
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
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-books">
              <p>
                Aucun livre trouvé. Commencez par ajouter des livres à votre
                bibliothèque.
              </p>
            </div>
          )}
        </div>
        {recentBooks.length > 0 && (
          <div className="view-all-books">
            <p>Affichage des {recentBooks.length} livres les plus récents</p>
          </div>
        )}
      </div>
      {/* Modals */}
      {modal.isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modal.type === "book" && (
              <div>
                <h3>
                  <i className="fas fa-plus"></i>
                  Ajouter un nouveau livre
                </h3>
                <form onSubmit={handleCreateBook}>
                  <div className="form-group">
                    <label>Titre:</label>
                    <input
                      type="text"
                      value={bookForm.titre}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, titre: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Auteur:</label>
                    <input
                      type="text"
                      value={bookForm.auteur}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, auteur: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ISBN:</label>
                    <input
                      type="text"
                      value={bookForm.isbn}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, isbn: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Année de publication:</label>
                    <input
                      type="number"
                      value={bookForm.anneePublication}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          anneePublication: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Genre:</label>
                    <input
                      type="text"
                      value={bookForm.genre}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, genre: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea
                      value={bookForm.description}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Description du livre (optionnelle)"
                    />
                  </div>
                  <div className="form-group">
                    <label>Nombre d'exemplaires:</label>
                    <input
                      type="number"
                      value={bookForm.nombreExemplaires}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          nombreExemplaires: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary btn-icon">
                      <i className="fas fa-save"></i>
                      Créer
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary btn-icon"
                    >
                      <i className="fas fa-times"></i>
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {modal.type === "user" && (
              <div>
                <h3>
                  <i className="fas fa-user-plus"></i>
                  Ajouter un nouvel utilisateur
                </h3>
                <form onSubmit={handleCreateUser}>
                  <div className="form-group">
                    <label>Nom:</label>
                    <input
                      type="text"
                      value={userForm.nom}
                      onChange={(e) =>
                        setUserForm({ ...userForm, nom: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Prénom:</label>
                    <input
                      type="text"
                      value={userForm.prenom}
                      onChange={(e) =>
                        setUserForm({ ...userForm, prenom: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm({ ...userForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary btn-icon">
                      <i className="fas fa-save"></i>
                      Créer
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary btn-icon"
                    >
                      <i className="fas fa-times"></i>
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {modal.type === "emprunt" && (
              <div>
                <h3>
                  <i className="fas fa-clipboard-list"></i>
                  Créer un nouvel emprunt
                </h3>
                <form onSubmit={handleCreateEmprunt}>
                  <div className="form-group">
                    <label>Utilisateur:</label>
                    <select
                      value={empruntForm.utilisateurId}
                      onChange={(e) =>
                        setEmpruntForm({
                          ...empruntForm,
                          utilisateurId: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Sélectionner un utilisateur</option>
                      {users.map((user: any) => (
                        <option key={user.id} value={user.id}>
                          {user.nom} {user.prenom} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Livre:</label>
                    <select
                      value={empruntForm.livreId}
                      onChange={(e) =>
                        setEmpruntForm({
                          ...empruntForm,
                          livreId: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Sélectionner un livre</option>
                      {books.map((book: any) => (
                        <option key={book.id} value={book.id}>
                          {book.titre} - {book.auteur}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary btn-icon">
                      <i className="fas fa-save"></i>
                      Créer
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary btn-icon"
                    >
                      <i className="fas fa-times"></i>
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
