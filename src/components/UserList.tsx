import React, { useState, useEffect } from "react";
import { userService } from "../services/userService";
import { User, CreateUserRequest } from "../types/User";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
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
        <button
          className="btn primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Annuler" : "➕ Nouvel utilisateur"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showCreateForm && (
        <form className="create-form" onSubmit={handleCreateUser}>
          <h3>Créer un nouvel utilisateur</h3>
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
          <button type="submit" className="btn primary">
            Créer
          </button>
        </form>
      )}

      <div className="table-container">
        <table className="users-table">
          <thead>
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
                    className="btn small secondary"
                    onClick={() => toggleUserStatus(user)}
                  >
                    {user.actif ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    className="btn small danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    🗑️
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
