import React, { useState, useEffect } from "react";
import { empruntService } from "../services/empruntService";
import { userService } from "../services/userService";
import { bookService } from "../services/bookService";
import { EmpruntAvecDetails, CreateEmpruntRequest } from "../types/Emprunt";
import { User } from "../types/User";
import { Book } from "../types/Book";

const EmpruntList: React.FC = () => {
  const [emprunts, setEmprunts] = useState<EmpruntAvecDetails[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "current" | "overdue" | "history"
  >("all");
  const [newEmprunt, setNewEmprunt] = useState<CreateEmpruntRequest>({
    utilisateurId: "",
    livreId: "",
    dureeEmprunt: 14,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [empruntsData, usersData, booksData] = await Promise.all([
        empruntService.getAllEmpruntsEnCours(),
        userService.getAllUsers(),
        bookService.getAvailableBooks(),
      ]);
      setEmprunts(empruntsData);
      setUsers(usersData);
      setAvailableBooks(booksData);
    } catch (err) {
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const loadEmpruntsByFilter = async () => {
    try {
      let data;
      switch (filter) {
        case "current":
          data = await empruntService.getAllEmpruntsEnCours();
          break;
        case "overdue":
          data = await empruntService.getEmpruntsEnRetard();
          break;
        case "history":
          data = await empruntService.getEmpruntsHistorique();
          break;
        default:
          data = await empruntService.getAllEmpruntsEnCours();
      }
      setEmprunts(data);
    } catch (err) {
      setError("Erreur lors du chargement des emprunts");
    }
  };

  useEffect(() => {
    if (!loading) {
      loadEmpruntsByFilter();
    }
  }, [filter]);

  const handleCreateEmprunt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await empruntService.createEmprunt(newEmprunt);
      setNewEmprunt({
        utilisateurId: "",
        livreId: "",
        dureeEmprunt: 14,
      });
      setShowCreateForm(false);
      loadData();
    } catch (err: any) {
      setError(
        "Cet utilisateur a déjà un emprunt en cours. Il doit le rendre avant d'en faire un autre."
      );
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleReturnBook = async (empruntId: string) => {
    if (window.confirm("Confirmer le retour de ce livre ?")) {
      try {
        await empruntService.returnBook(empruntId);
        loadData();
      } catch (err) {
        setError("Erreur lors du retour du livre");
      }
    }
  };

  const getStatusInfo = (
    statut: string
  ): { className: string; icon: string; label: string } => {
    switch (statut) {
      case "EN_COURS":
        return {
          className: "status-current",
          icon: "fa-clock",
          label: "En cours",
        };
      case "EN_RETARD":
        return {
          className: "status-overdue",
          icon: "fa-exclamation-triangle",
          label: "En retard",
        };
      case "RETOURNE":
        return {
          className: "status-returned",
          icon: "fa-check-circle",
          label: "Retourné",
        };
      default:
        return {
          className: "status-current",
          icon: "fa-clock",
          label: "En cours",
        };
    }
  };

  const getDaysRemaining = (dateRetourPrevu: string) => {
    const today = new Date();
    const dueDate = new Date(dateRetourPrevu);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="emprunt-list">
      <div className="header">
        <h2>Gestion des Emprunts</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className={`btn ${filter === "history" ? "active" : "secondary"}`}
            onClick={() => setFilter("history")}
            style={{ borderRadius: "8px" }}
          >
            Historiques
          </button>
          <button
            className="btn primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "Annuler" : "➕ Nouvel emprunt"}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="filters">
        <div
          className="filter-buttons"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              background: "#f5f5f5",
              borderRadius: "8px",
              gap: "10px",
            }}
          >
            <button
              className={`btn ${filter === "all" ? "active" : "secondary"}`}
              onClick={() => setFilter("all")}
              style={{ borderRadius: "8px" }}
            >
              Tous
            </button>
            <button
              className={`btn ${filter === "current" ? "active" : "secondary"}`}
              onClick={() => setFilter("current")}
              style={{ borderRadius: "8px" }}
            >
              En cours
            </button>
            <button
              className={`btn ${filter === "overdue" ? "active" : "secondary"}`}
              onClick={() => setFilter("overdue")}
              style={{ borderRadius: "8px" }}
            >
              En retard
            </button>
          </div>
        </div>
      </div>

      {showCreateForm && (
        <form className="create-form" onSubmit={handleCreateEmprunt}>
          <h3>Créer un nouvel emprunt</h3>

          <div className="form-group">
            <select
              value={newEmprunt.utilisateurId}
              onChange={(e) =>
                setNewEmprunt({ ...newEmprunt, utilisateurId: e.target.value })
              }
              required
            >
              <option value="">Sélectionner un utilisateur</option>
              {users
                .filter((user) => user.actif)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nom} {user.prenom} ({user.email})
                  </option>
                ))}
            </select>

            <select
              value={newEmprunt.livreId}
              onChange={(e) =>
                setNewEmprunt({ ...newEmprunt, livreId: e.target.value })
              }
              required
            >
              <option value="">Sélectionner un livre</option>
              {availableBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.titre} - {book.auteur}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Durée d'emprunt (jours)"
              value={newEmprunt.dureeEmprunt}
              onChange={(e) =>
                setNewEmprunt({
                  ...newEmprunt,
                  dureeEmprunt: parseInt(e.target.value),
                })
              }
              min="1"
              max="30"
            />
          </div>
          <button type="submit" className="btn primary">
            Créer l'emprunt
          </button>
        </form>
      )}

      <div className="table-container">
        <table className="emprunts-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Livre</th>
              <th>Date d'emprunt</th>
              <th>Retour prévu</th>
              {filter === "history" && <th>Retour réel</th>}
              <th>{filter === "history" ? "Durée" : "Jours restants"}</th>
              <th>Statut</th>
              {filter !== "history" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {emprunts.map((emprunt) => {
              const daysRemaining = getDaysRemaining(
                emprunt.dateRetourPrevu.toString()
              );

              // Calcul de la durée pour l'historique
              const getDuration = () => {
                if (filter === "history" && emprunt.dateRetourEffectif) {
                  const dateEmprunt = new Date(emprunt.dateEmprunt);
                  const dateRetour = new Date(emprunt.dateRetourEffectif);
                  const diffTime = dateRetour.getTime() - dateEmprunt.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return `${diffDays} jours`;
                }
                return null;
              };

              const duration = getDuration();

              return (
                <tr key={emprunt.id}>
                  <td>
                    <div>
                      <strong>
                        {emprunt.utilisateur.nom} {emprunt.utilisateur.prenom}
                      </strong>
                      <br />
                      <small>{emprunt.utilisateur.email}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{emprunt.livre.titre}</strong>
                      <br />
                      <small>{emprunt.livre.auteur}</small>
                    </div>
                  </td>
                  <td>{new Date(emprunt.dateEmprunt).toLocaleDateString()}</td>
                  <td>
                    {new Date(emprunt.dateRetourPrevu).toLocaleDateString()}
                  </td>
                  {filter === "history" && (
                    <td>
                      {emprunt.dateRetourEffectif
                        ? new Date(
                            emprunt.dateRetourEffectif
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                  )}
                  <td>
                    {filter === "history" ? (
                      <span className="normal">{duration || "-"}</span>
                    ) : (
                      <span
                        className={
                          daysRemaining < 0
                            ? "overdue"
                            : daysRemaining <= 3
                            ? "warning"
                            : "normal"
                        }
                      >
                        {daysRemaining < 0
                          ? `${Math.abs(daysRemaining)} jours de retard`
                          : `${daysRemaining} jours`}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`status ${
                        getStatusInfo(emprunt.statut).className
                      }`}
                    >
                      <i
                        className={`fas ${getStatusInfo(emprunt.statut).icon}`}
                      ></i>
                      {getStatusInfo(emprunt.statut).label}
                    </span>
                  </td>
                  {filter !== "history" && (
                    <td className="actions">
                      {emprunt.statut === "EN_COURS" && (
                        <button
                          className="btn small primary"
                          onClick={() => handleReturnBook(emprunt.id)}
                        >
                          <i className="fas fa-check"></i> Retourner le livre
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {emprunts.length === 0 && (
        <div className="empty-state">
          <p>Aucun emprunt trouvé</p>
        </div>
      )}
    </div>
  );
};

export default EmpruntList;
