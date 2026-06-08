import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { userService } from "../services/userService";
import { bookService } from "../services/bookService";
import { empruntService } from "../services/empruntService";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/User";
import { isLecteur, USER_ROLES } from "../constants/roles";
import { EmpruntAvecDetails } from "../types/Emprunt";
import { Book } from "../types/Book";
import PasswordInput from "./PasswordInput";

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
  const { user, isBibliothecaire } = useAuth();
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
  const [myEmprunts, setMyEmprunts] = useState<EmpruntAvecDetails[]>([]);

  const [bookForm, setBookForm] = useState({
    titre: "",
    auteur: "",
    isbn: "",
    anneePublication: new Date().getFullYear(),
    genre: "",
    description: "",
    nombreExemplaires: 1,
  });
  const [userForm, setUserForm] = useState<{
    nom: string;
    prenom: string;
    email: string;
    password: string;
    role: UserRole;
  }>({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    role: USER_ROLES.LECTEUR,
  });
  const [empruntForm, setEmpruntForm] = useState({
    utilisateurId: "",
    livreId: "",
  });
  const [users, setUsers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);

  const loadUsersAndBooks = useCallback(async () => {
    try {
      const [usersData, booksData, allBooksData] = await Promise.all([
        userService.getAllUsers(),
        bookService.getAvailableBooks(),
        bookService.getAllBooks(),
      ]);
      setUsers(usersData);
      setBooks(booksData);
      const sortedBooks = allBooksData
        .sort(
          (a, b) =>
            new Date(b.dateAjout).getTime() - new Date(a.dateAjout).getTime()
        )
        .slice(0, 5);
      setRecentBooks(sortedBooks);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      if (isBibliothecaire) {
        const [usersData, allBooks, availableBooks, currentLoans, overdueLoans] =
          await Promise.all([
            userService.getAllUsers(),
            bookService.getAllBooks(),
            bookService.getAvailableBooks(),
            empruntService.getAllEmpruntsEnCours(),
            empruntService.getEmpruntsEnRetard(),
          ]);

        setStats({
          totalUsers: usersData.length,
          totalBooks: allBooks.length,
          availableBooks: availableBooks.length,
          currentLoans: currentLoans.length,
          overdueLoans: overdueLoans.length,
        });
      } else if (user) {
        const [allBooks, availableBooks, emprunts] = await Promise.all([
          bookService.getAllBooks(),
          bookService.getAvailableBooks(),
          empruntService.getEmpruntsByUserId(user.id),
        ]);

        setMyEmprunts(emprunts);
        const enCours = emprunts.filter(
          (e) => e.statut === "EN_COURS" || e.statut === "EN_RETARD"
        );

        setStats({
          totalUsers: 0,
          totalBooks: allBooks.length,
          availableBooks: availableBooks.length,
          currentLoans: enCours.length,
          overdueLoans: emprunts.filter((e) => e.statut === "EN_RETARD").length,
        });

        const sortedBooks = allBooks
          .sort(
            (a, b) =>
              new Date(b.dateAjout).getTime() - new Date(a.dateAjout).getTime()
          )
          .slice(0, 5);
        setRecentBooks(sortedBooks);
      }
    } catch {
      setError("Erreur lors du chargement des données du dashboard");
    } finally {
      setLoading(false);
    }
  }, [isBibliothecaire, user]);

  useEffect(() => {
    loadDashboardData();
    if (isBibliothecaire) {
      loadUsersAndBooks();
    }
  }, [isBibliothecaire, loadDashboardData, loadUsersAndBooks]);

  const openModal = (type: "book" | "user" | "emprunt") => {
    setModal({ type, isOpen: true });
  };

  const closeModal = () => {
    setModal({ type: null, isOpen: false });
    setBookForm({
      titre: "",
      auteur: "",
      isbn: "",
      anneePublication: new Date().getFullYear(),
      genre: "",
      description: "",
      nombreExemplaires: 1,
    });
    setUserForm({ nom: "", prenom: "", email: "", password: "", role: USER_ROLES.LECTEUR });
    setEmpruntForm({ utilisateurId: "", livreId: "" });
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bookService.createBook({
        ...bookForm,
        description: bookForm.description || undefined,
      });
      closeModal();
      loadDashboardData();
      loadUsersAndBooks();
    } catch {
      alert("Erreur lors de la création du livre");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.createUser(userForm);
      closeModal();
      loadDashboardData();
      loadUsersAndBooks();
    } catch {
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
    } catch {
      alert("Erreur lors de la création de l'emprunt");
    }
  };

  const empruntActif = myEmprunts.find(
    (e) => e.statut === "EN_COURS" || e.statut === "EN_RETARD"
  );

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h2>
        {isBibliothecaire
          ? "Dashboard - Vue d'ensemble"
          : `Bienvenue, ${user?.prenom} !`}
      </h2>

      <div className="stats-grid">
        {isBibliothecaire && (
          <div className="stat-card users">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <h3>Utilisateurs</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
          </div>
        )}

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
            <h3>{isBibliothecaire ? "Emprunts en cours" : "Mon emprunt"}</h3>
            <p className="stat-number">{stats.currentLoans}</p>
          </div>
        </div>

        {isBibliothecaire && (
          <div className="stat-card overdue">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-content">
              <h3>Emprunts en retard</h3>
              <p className="stat-number">{stats.overdueLoans}</p>
            </div>
          </div>
        )}
      </div>

      {!isBibliothecaire && empruntActif && (
        <div className="current-loan-card">
          <h3>
            <i className="fas fa-book-reader"></i> Emprunt en cours
          </h3>
          <p>
            <strong>{empruntActif.livre.titre}</strong> par {empruntActif.livre.auteur}
          </p>
          <p>
            Retour prévu le{" "}
            {new Date(empruntActif.dateRetourPrevu).toLocaleDateString("fr-FR")}
          </p>
          {empruntActif.statut === "EN_RETARD" && (
            <span className="status status-overdue">
              <i className="fas fa-exclamation-triangle"></i> En retard
            </span>
          )}
        </div>
      )}

      {!isBibliothecaire && !empruntActif && (
        <div className="dashboard-actions">
          <h3>Emprunter un livre</h3>
          <Link to="/books" className="action-btn primary btn-icon">
            <i className="fas fa-book"></i>
            Parcourir le catalogue
          </Link>
        </div>
      )}

      {isBibliothecaire && (
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
      )}

      <div className="books-overview">
        <h3>
          <i className="fas fa-book" style={{ marginRight: "10px" }}></i>
          Livres récents
        </h3>
        <div className="books-grid">
          {recentBooks.length > 0 ? (
            recentBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-info">
                  <h4 className="book-title">{book.titre}</h4>
                  <p className="book-author">par {book.auteur}</p>
                  <p className="book-genre">{book.genre}</p>
                  <div className="book-details">
                    <span className="book-year">{book.anneePublication}</span>
                    <span
                      className="book-status"
                      style={{
                        background: book.disponible ? "#d4edda" : "#f8d7da",
                        color: book.disponible ? "#155724" : "#721c24",
                        borderRadius: "8px",
                        padding: "2px 8px",
                        fontWeight: 600,
                        fontSize: "12px",
                      }}
                    >
                      {book.disponible ? "Disponible" : "Indisponible"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-books">
              <p>Aucun livre dans le catalogue.</p>
            </div>
          )}
        </div>
      </div>

      {modal.isOpen && isBibliothecaire && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modal.type === "book" && (
              <div>
                <h3>
                  <i className="fas fa-plus"></i> Ajouter un nouveau livre
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
                    <label>Description :</label>
                    <textarea
                      value={bookForm.description}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, description: e.target.value })
                      }
                      rows={3}
                      placeholder="Description du livre (optionnelle)"
                    />
                  </div>
                  <div className="form-group">
                    <label>Nombre d&apos;exemplaires:</label>
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
                      <i className="fas fa-save"></i> Créer
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary btn-icon"
                    >
                      <i className="fas fa-times"></i> Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {modal.type === "user" && (
              <div>
                <h3>
                  <i className="fas fa-user-plus"></i> Ajouter un utilisateur
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
                  <PasswordInput
                    id="dashboard-user-password"
                    label="Mot de passe :"
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm({ ...userForm, password: e.target.value })
                    }
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <div className="form-group">
                    <label>Rôle:</label>
                    <select
                      value={userForm.role}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          role: e.target.value as UserRole,
                        })
                      }
                    >
                      <option value={USER_ROLES.LECTEUR}>Lecteur</option>
                      <option value={USER_ROLES.BIBLIOTHECAIRE}>Bibliothécaire</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary btn-icon">
                      <i className="fas fa-save"></i> Créer
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary btn-icon"
                    >
                      <i className="fas fa-times"></i> Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {modal.type === "emprunt" && (
              <div>
                <h3>
                  <i className="fas fa-clipboard-list"></i> Créer un emprunt
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
                      <option value="">Sélectionner un lecteur</option>
                      {users
                        .filter((u) => u.actif && isLecteur(u.role))
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.nom} {u.prenom} ({u.email})
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
                      {books.map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.titre} - {book.auteur}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary btn-icon">
                      <i className="fas fa-save"></i> Créer
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary btn-icon"
                    >
                      <i className="fas fa-times"></i> Annuler
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
