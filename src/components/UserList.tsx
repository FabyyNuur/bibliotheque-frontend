import React, { useState, useEffect } from "react";
import { userService } from "../services/userService";
import { User, CreateUserRequest } from "../types/User";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    nom: "",
    prenom: "",
    email: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.createUser(newUser);
      setNewUser({ nom: "", prenom: "", email: "" });
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
      });
      setNewUser({ nom: "", prenom: "", email: "" });
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
    setNewUser({ nom: "", prenom: "", email: "" });
  };

  const handleDeleteUser = async (id: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        await userService.deleteUser(id);
        loadUsers();
      } catch (err) {
        setError("Erreur lors de la suppression de l'utilisateur");
      }
    }
  };

  const toggleUserStatus = async (user: User) => {
    try {
      await userService.updateUser(user.id, { actif: !user.actif });
      loadUsers();
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut");
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="user-list">
      <div className="header">
        <h2>Gestion des Utilisateurs</h2>
        <div className="header-buttons">
          {showEditForm && (
            <button className="btn secondary" onClick={cancelEdit}>
              Annuler modification
            </button>
          )}
          <button
            className="btn primary"
            onClick={() => {
              if (showEditForm) {
                cancelEdit();
              } else {
                setShowCreateForm(!showCreateForm);
              }
            }}
          >
            {showCreateForm
              ? "Annuler"
              : showEditForm
              ? "Nouvel utilisateur"
              : "➕ Nouvel utilisateur"}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

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
          </div>
          <div className="form-actions">
            <button type="submit" className="btn primary">
              {showEditForm ? "Modifier" : "Créer"}
            </button>
            {showEditForm && (
              <button
                type="button"
                className="btn secondary"
                onClick={cancelEdit}
              >
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
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>{user.email}</td>
                <td>{new Date(user.dateInscription).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`status ${user.actif ? "active" : "inactive"}`}
                  >
                    {user.actif ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="btn small primary"
                    onClick={() => handleEditUser(user)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn small black"
                    onClick={() => toggleUserStatus(user)}
                  >
                    {user.actif ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    className="btn small danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="empty-state">
          <p>Aucun utilisateur trouvé</p>
        </div>
      )}
    </div>
  );
};

export default UserList;
