import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await userService.updateUser(user.id, form);
      await refreshUser();
      setSuccess('Profil mis à jour avec succès');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || 'Erreur lors de la mise à jour';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-list">
      <div className="header">
        <h2>Mon profil</h2>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="profile-info">
        <p>
          <strong>Rôle :</strong>{' '}
          {user.role === 'BIBLIOTHECAIRE' ? 'Bibliothécaire' : 'Lecteur'}
        </p>
        <p>
          <strong>Membre depuis :</strong>{' '}
          {new Date(user.dateInscription).toLocaleDateString('fr-FR')}
        </p>
        <p>
          <strong>Statut :</strong>{' '}
          <span className={`status ${user.actif ? 'active' : 'inactive'}`}>
            {user.actif ? 'Actif' : 'Inactif'}
          </span>
        </p>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        <h3>Modifier mes informations</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Prénom"
            value={form.prenom}
            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn primary btn-icon" disabled={loading}>
          <i className="fas fa-save"></i>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
