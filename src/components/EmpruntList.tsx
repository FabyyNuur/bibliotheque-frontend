import React, { useState, useEffect, useCallback, useMemo } from "react";
import { empruntService } from "../services/empruntService";
import { userService } from "../services/userService";
import { bookService } from "../services/bookService";
import { EmpruntAvecDetails, CreateEmpruntRequest } from "../types/Emprunt";
import { User } from "../types/User";
import { Book } from "../types/Book";
import EmpruntCreateForm, { EmpruntFormState } from "./EmpruntCreateForm";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [newEmprunt, setNewEmprunt] = useState<EmpruntFormState>({
    utilisateurId: "",
    livreId: "",
    dureeEmprunt: 14,
  });

  const resetEmpruntForm = () => {
    setNewEmprunt({
      utilisateurId: "",
      livreId: "",
      dureeEmprunt: 14,
    });
  };

  const openCreateModal = () => setShowCreateForm(true);

  const closeCreateModal = () => {
    setShowCreateForm(false);
    resetEmpruntForm();
  };

  const loadEmpruntsByFilter = useCallback(async () => {
    switch (filter) {
      case "current":
        return empruntService.getAllEmpruntsEnCours();
      case "overdue":
        return empruntService.getEmpruntsEnRetard();
      case "history":
        return empruntService.getEmpruntsHistorique();
      default:
        return empruntService.getAllEmpruntsEnCours();
    }
  }, [filter]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [empruntsData, usersData, booksData] = await Promise.all([
        loadEmpruntsByFilter(),
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
  }, [loadEmpruntsByFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateEmprunt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: CreateEmpruntRequest = {
        livreId: newEmprunt.livreId,
        dureeEmprunt: newEmprunt.dureeEmprunt,
      };
      if (newEmprunt.utilisateurId) {
        payload.utilisateurId = newEmprunt.utilisateurId;
      }
      await empruntService.createEmprunt(payload);
      closeCreateModal();
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

  const filteredEmprunts = useMemo(() => {
    if (!searchQuery.trim()) return emprunts;

    const query = searchQuery.toLowerCase();
    return emprunts.filter((emprunt) => {
      const statusLabel = getStatusInfo(emprunt.statut).label.toLowerCase();
      return (
        emprunt.utilisateur.nom.toLowerCase().includes(query) ||
        emprunt.utilisateur.prenom.toLowerCase().includes(query) ||
        emprunt.utilisateur.email.toLowerCase().includes(query) ||
        emprunt.livre.titre.toLowerCase().includes(query) ||
        emprunt.livre.auteur.toLowerCase().includes(query) ||
        emprunt.livre.isbn.toLowerCase().includes(query) ||
        statusLabel.includes(query)
      );
    });
  }, [emprunts, searchQuery]);

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
        <div className="header-buttons">
          <button
            className={`btn ${filter === "history" ? "active" : "secondary"}`}
            onClick={() => setFilter("history")}
            style={{ borderRadius: "8px" }}
          >
            Historiques
          </button>
          <button
            className="btn primary btn-icon"
            onClick={openCreateModal}
            data-testid="emprunt-create-open"
          >
            <i className="fas fa-plus"></i>
            Nouvel emprunt
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher par lecteur, livre, ISBN ou statut..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
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
        <div
          className="modal-overlay"
          onClick={closeCreateModal}
          data-testid="emprunt-create-modal"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              <i className="fas fa-clipboard-list"></i> Créer un nouvel emprunt
            </h3>
            <EmpruntCreateForm
              form={newEmprunt}
              users={users}
              books={availableBooks}
              onChange={(update) =>
                setNewEmprunt((prev) => ({ ...prev, ...update }))
              }
              onSubmit={handleCreateEmprunt}
              onCancel={closeCreateModal}
            />
          </div>
        </div>
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
            {filteredEmprunts.map((emprunt) => {
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
                          data-testid="emprunt-return"
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

      {filteredEmprunts.length === 0 && (
        <div className="empty-state">
          <p>
            {searchQuery
              ? "Aucun emprunt ne correspond à votre recherche"
              : "Aucun emprunt trouvé"}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmpruntList;
