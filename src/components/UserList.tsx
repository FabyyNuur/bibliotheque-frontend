import React, { useState, useEffect, useMemo } from "react";
import { userService } from "../services/userService";
import { empruntService } from "../services/empruntService";
import { User, CreateUserRequest, UserRole } from "../types/User";
import { getRoleLabel, USER_ROLES } from "../constants/roles";
import PasswordInput from "./PasswordInput";
import { useAuth } from "../context/AuthContext";

const UserList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userEmprunts, setUserEmprunts] = useState<any[]>([]);
  const [loadingEmprunts, setLoadingEmprunts] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    role: USER_ROLES.LECTEUR,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.nom.toLowerCase().includes(query) ||
        user.prenom.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        getRoleLabel(user.role).toLowerCase().includes(query) ||
        (user.actif ? "actif" : "inactif").includes(query)
    );
  }, [users, searchQuery]);

  // Fonction utilitaire pour formater les dates
  const formatDate = (dateString: string | Date | null | undefined): string => {
    console.log("Formatage de la date:", dateString, typeof dateString);

    if (!dateString || dateString === null || dateString === undefined) {
      return "Date non disponible";
    }

    try {
      // Si c'est déjà un objet Date
      if (dateString instanceof Date) {
        return dateString.toLocaleDateString("fr-FR");
      }

      // Si c'est une string vide
      if (typeof dateString === "string" && dateString.trim() === "") {
        return "Date non disponible";
      }

      // Essayer de créer une Date
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        console.warn("Date invalide:", dateString);
        return "Date invalide";
      }

      return date.toLocaleDateString("fr-FR");
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", dateString, error);
      return "Date invalide";
    }
  };

  // Fonction spéciale pour les dates optionnelles (comme dateRetourReelle)
  const formatOptionalDate = (
    dateString: string | Date | null | undefined
  ): string | null => {
    if (!dateString || dateString === null || dateString === undefined) {
      return null; // Retourner null pour les dates optionnelles non définies
    }
    return formatDate(dateString);
  }; // Fonction pour déterminer le statut d'un emprunt
  const getEmpruntStatus = (
    emprunt: any
  ): { status: string; className: string; icon: string } => {
    if (emprunt.dateRetourEffectif) {
      return {
        status: "Retourné",
        className: "status-returned",
        icon: "fa-check-circle",
      };
    }

    if (emprunt.statut) {
      // Si le statut est déjà fourni par le backend
      if (emprunt.statut === "EN_RETARD") {
        return {
          status: "En retard",
          className: "status-overdue",
          icon: "fa-exclamation-triangle",
        };
      } else if (emprunt.statut === "RETOURNE") {
        return {
          status: "Retourné",
          className: "status-returned",
          icon: "fa-check-circle",
        };
      }
      return {
        status: "En cours",
        className: "status-current",
        icon: "fa-clock",
      };
    }

    try {
      const dateRetourPrevu = new Date(emprunt.dateRetourPrevu);
      const maintenant = new Date();

      if (isNaN(dateRetourPrevu.getTime())) {
        return {
          status: "En cours",
          className: "status-current",
          icon: "fa-clock",
        };
      }

      if (dateRetourPrevu < maintenant) {
        return {
          status: "En retard",
          className: "status-overdue",
          icon: "fa-exclamation-triangle",
        };
      } else {
        return {
          status: "En cours",
          className: "status-current",
          icon: "fa-clock",
        };
      }
    } catch (error) {
      console.error("Erreur lors du calcul du statut:", error);
      return {
        status: "En cours",
        className: "status-current",
        icon: "fa-clock",
      };
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      console.log("Données utilisateurs reçues:", data);
      if (data.length > 0) {
        console.log("Premier utilisateur:", data[0]);
        console.log(
          "Date d'inscription:",
          data[0].dateInscription,
          typeof data[0].dateInscription
        );
      }
      setUsers(data);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const loadUserEmprunts = async (userId: string) => {
    try {
      setLoadingEmprunts(true);
      console.log("Chargement des emprunts pour l'utilisateur:", userId);
      const emprunts = await empruntService.getEmpruntsByUserId(userId);
      console.log("Emprunts reçus:", emprunts);

      // Debug pour voir la structure des données
      if (emprunts.length > 0) {
        console.log("Premier emprunt détaillé:", emprunts[0]);
        console.log(
          "dateEmprunt:",
          emprunts[0].dateEmprunt,
          typeof emprunts[0].dateEmprunt
        );
        console.log(
          "dateRetourPrevu:",
          emprunts[0].dateRetourPrevu,
          typeof emprunts[0].dateRetourPrevu
        );
        console.log(
          "dateRetourEffectif:",
          emprunts[0].dateRetourEffectif,
          typeof emprunts[0].dateRetourEffectif
        );
      }

      setUserEmprunts(emprunts);
    } catch (err) {
      console.error("Erreur lors du chargement des emprunts:", err);
      setUserEmprunts([]);
    } finally {
      setLoadingEmprunts(false);
    }
  };

  const handleViewUserDetails = async (user: User) => {
    console.log("Affichage des détails pour l'utilisateur:", user);
    setSelectedUser(user);
    setUserEmprunts([]); // Réinitialiser les emprunts avant de charger les nouveaux
    setShowUserDetails(true);
    await loadUserEmprunts(user.id);
  };

  const closeUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
    setUserEmprunts([]);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.createUser(newUser);
      setNewUser({ nom: "", prenom: "", email: "", password: "", role: USER_ROLES.LECTEUR });
      setShowCreateForm(false);
      loadUsers();
    } catch (err) {
      setError("Erreur lors de la création de l'utilisateur");
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await userService.updateUser(editingUser.id, {
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email,
        role: newUser.role,
      });
      setNewUser({ nom: "", prenom: "", email: "", password: "", role: USER_ROLES.LECTEUR });
      setShowEditForm(false);
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      setError("Erreur lors de la modification de l'utilisateur");
    }
  };

  const cancelEdit = () => {
    setShowEditForm(false);
    setEditingUser(null);
    setNewUser({ nom: "", prenom: "", email: "", password: "", role: USER_ROLES.LECTEUR });
  };

  const isCurrentUser = (userId: string) => currentUser?.id === userId;

  const handleDeleteUser = async (id: string) => {
    if (isCurrentUser(id)) {
      setError("Vous ne pouvez pas supprimer votre propre compte");
      return;
    }

    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        await userService.deleteUser(id);
        loadUsers();
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { error?: string } } })?.response?.data
            ?.error || "Erreur lors de la suppression de l'utilisateur";
        setError(message);
      }
    }
  };

  const toggleUserStatus = async (user: User) => {
    if (isCurrentUser(user.id) && user.actif) {
      setError("Vous ne pouvez pas désactiver votre propre compte");
      return;
    }

    try {
      await userService.updateUser(user.id, { actif: !user.actif });
      loadUsers();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Erreur lors de la mise à jour du statut";
      setError(message);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="user-list">
      <div className="header">
        <h2>Gestion des Utilisateurs</h2>
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
            <i className="fas fa-user-plus"></i>
            {showCreateForm
              ? "Annuler"
              : showEditForm
              ? "Nouvel utilisateur"
              : "Nouvel utilisateur"}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher par nom, prénom, email ou rôle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {(showCreateForm || showEditForm) && (
        <form
          className="create-form"
          onSubmit={showEditForm ? handleUpdateUser : handleCreateUser}
        >
          <h3>
            {showEditForm
              ? "Modifier l'utilisateur"
              : "Créer un nouvel utilisateur"}
          </h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nom"
              value={newUser.nom}
              onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Prénom"
              value={newUser.prenom}
              onChange={(e) =>
                setNewUser({ ...newUser, prenom: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
            />
            {!showEditForm && (
              <PasswordInput
                placeholder="Mot de passe (min. 6 caractères)"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
                minLength={6}
                autoComplete="new-password"
              />
            )}
            <select
              value={newUser.role || USER_ROLES.LECTEUR}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  role: e.target.value as UserRole,
                })
              }
            >
              <option value={USER_ROLES.LECTEUR}>Lecteur</option>
              <option value={USER_ROLES.BIBLIOTHECAIRE}>Bibliothécaire</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn primary btn-icon">
              <i className="fas fa-save"></i>
              {showEditForm ? "Modifier" : "Créer"}
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

      <div className="table-container">
        <table className="users-table">
          <thead className="table-header-white">
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Date d'inscription</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.dateInscription)}</td>
                <td>
                  <span className="role-badge">
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td>
                  <span
                    className={`status ${user.actif ? "active" : "inactive"}`}
                  >
                    <i
                      className={`fas ${
                        user.actif ? "fa-check-circle" : "fa-times-circle"
                      }`}
                    ></i>
                    {user.actif ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="btn small secondary btn-icon-only"
                    onClick={() => handleViewUserDetails(user)}
                    title="Voir les détails"
                  >
                    <i className="fas fa-info-circle"></i>
                  </button>
                  <button
                    className="btn small secondary btn-icon-only"
                    onClick={() => handleEditUser(user)}
                    title="Modifier"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  {!(isCurrentUser(user.id) && user.actif) && (
                    <button
                      className="btn small secondary btn-icon"
                      onClick={() => toggleUserStatus(user)}
                      title={user.actif ? "Désactiver" : "Activer"}
                    >
                      <i
                        className={`fas ${
                          user.actif ? "fa-toggle-off" : "fa-toggle-on"
                        }`}
                      ></i>
                      {user.actif ? "Désactiver" : "Activer"}
                    </button>
                  )}
                  {isCurrentUser(user.id) && user.actif && (
                    <span className="self-account-hint" title="Compte connecté">
                      <i className="fas fa-user-shield"></i> Vous
                    </span>
                  )}
                  {!isCurrentUser(user.id) && (
                    <button
                      className="btn small danger btn-icon-only"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Supprimer"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <p>
            {searchQuery
              ? "Aucun utilisateur ne correspond à votre recherche"
              : "Aucun utilisateur trouvé"}
          </p>
        </div>
      )}

      {/* Modal pour les détails de l'utilisateur */}
      {showUserDetails && selectedUser && (
        <div className="modal-overlay" onClick={closeUserDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Détails de l'utilisateur</h3>

            <div className="user-info">
              <div className="user-basic-info">
                <h4>
                  {selectedUser.nom} {selectedUser.prenom}
                </h4>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Date d'inscription:</strong>{" "}
                  {formatDate(selectedUser.dateInscription)}
                </p>
                <p>
                  <strong>Rôle:</strong>{" "}
                  {getRoleLabel(selectedUser.role)}
                </p>
                <p>
                  <strong>Statut:</strong>
                  <span
                    className={`status ${
                      selectedUser.actif ? "active" : "inactive"
                    }`}
                  >
                    <i
                      className={`fas ${
                        selectedUser.actif
                          ? "fa-check-circle"
                          : "fa-times-circle"
                      }`}
                    ></i>
                    {selectedUser.actif ? "Actif" : "Inactif"}
                  </span>
                </p>
              </div>
            </div>

            <div className="user-emprunts">
              <h4>Historique des emprunts</h4>
              {loadingEmprunts ? (
                <div className="loading">Chargement des emprunts...</div>
              ) : userEmprunts.length > 0 ? (
                <div className="emprunts-list">
                  {userEmprunts.map((emprunt: any) => (
                    <div key={emprunt.id} className="emprunt-card">
                      <div className="emprunt-book">
                        <strong>
                          {emprunt.livre?.titre || "Livre non trouvé"}
                        </strong>
                        <p>par {emprunt.livre?.auteur || "Auteur inconnu"}</p>
                      </div>
                      <div className="emprunt-dates">
                        <p>
                          <strong>Emprunté le:</strong>{" "}
                          {formatDate(emprunt.dateEmprunt)}
                        </p>
                        <p>
                          <strong>Retour prévu:</strong>{" "}
                          {formatDate(emprunt.dateRetourPrevu)}
                        </p>
                        {(() => {
                          const dateRetour = formatOptionalDate(
                            emprunt.dateRetourEffectif
                          );
                          return dateRetour ? (
                            <p>
                              <strong>Retourné le:</strong> {dateRetour}
                            </p>
                          ) : null;
                        })()}
                      </div>
                      <div className="emprunt-status">
                        {(() => {
                          const statusInfo = getEmpruntStatus(emprunt);
                          return (
                            <span className={`status ${statusInfo.className}`}>
                              <i className={`fas ${statusInfo.icon}`}></i>
                              {statusInfo.status}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-emprunts">
                  Aucun emprunt trouvé pour cet utilisateur.
                </p>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary btn-icon"
                onClick={closeUserDetails}
              >
                <i className="fas fa-times"></i>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
