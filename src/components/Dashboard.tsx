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
  });
  const [userForm, setUserForm] = useState({ nom: "", prenom: "", email: "" });
  const [empruntForm, setEmpruntForm] = useState({
    utilisateurId: "",
    livreId: "",
  });
  const [users, setUsers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    loadUsersAndBooks();
  }, []);

  const loadUsersAndBooks = async () => {
    try {
      const [usersData, booksData] = await Promise.all([
        userService.getAllUsers(),
        bookService.getAvailableBooks(),
      ]);
      setUsers(usersData);
      setBooks(booksData);
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
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Utilisateurs</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card books">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Total Livres</h3>
            <p className="stat-number">{stats.totalBooks}</p>
          </div>
        </div>

        <div className="stat-card available">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Livres Disponibles</h3>
            <p className="stat-number">{stats.availableBooks}</p>
          </div>
        </div>

        <div className="stat-card loans">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <h3>Emprunts en cours</h3>
            <p className="stat-number">{stats.currentLoans}</p>
          </div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-icon">⚠️</div>
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
            className="action-btn primary"
            onClick={() => openModal("book")}
          >
            ➕ Ajouter un livre
          </button>
          <button
            className="action-btn secondary"
            onClick={() => openModal("user")}
          >
            👤 Nouveau utilisateur
          </button>
          <button
            className="action-btn tertiary"
            onClick={() => openModal("emprunt")}
          >
            📋 Nouvel emprunt
          </button>
        </div>
      </div>

      {/* Modals */}
      {modal.isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modal.type === "book" && (
              <div>
                <h3>Ajouter un nouveau livre</h3>
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
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Créer
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {modal.type === "user" && (
              <div>
                <h3>Ajouter un nouvel utilisateur</h3>
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
                    <button type="submit" className="btn-primary">
                      Créer
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {modal.type === "emprunt" && (
              <div>
                <h3>Créer un nouvel emprunt</h3>
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
                    <button type="submit" className="btn-primary">
                      Créer
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary"
                    >
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
