import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { empruntService } from '../services/empruntService';
import { EmpruntAvecDetails } from '../types/Emprunt';

const MesEmprunts: React.FC = () => {
  const { user } = useAuth();
  const [emprunts, setEmprunts] = useState<EmpruntAvecDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmprunts = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await empruntService.getEmpruntsByUserId(user.id);
      setEmprunts(data);
    } catch {
      setError('Erreur lors du chargement de vos emprunts');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadEmprunts();
  }, [loadEmprunts]);

  const getStatusInfo = (statut: string) => {
    switch (statut) {
      case 'EN_RETARD':
        return { className: 'status-overdue', icon: 'fa-exclamation-triangle', label: 'En retard' };
      case 'RETOURNE':
        return { className: 'status-returned', icon: 'fa-check-circle', label: 'Retourné' };
      default:
        return { className: 'status-current', icon: 'fa-clock', label: 'En cours' };
    }
  };

  const empruntEnCours = emprunts.find((e) => e.statut === 'EN_COURS' || e.statut === 'EN_RETARD');

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="emprunt-list">
      <div className="header">
        <h2>Mes emprunts</h2>
        {!empruntEnCours && (
          <Link to="/books" className="btn primary btn-icon">
            <i className="fas fa-book"></i>
            Emprunter un livre
          </Link>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {empruntEnCours && (
        <div className="info-banner">
          <i className="fas fa-info-circle"></i>
          Vous avez un emprunt en cours. Rendez le livre avant d&apos;en emprunter un autre.
        </div>
      )}

      <div className="table-container">
        <table className="emprunts-table">
          <thead>
            <tr>
              <th>Livre</th>
              <th>Date d&apos;emprunt</th>
              <th>Retour prévu</th>
              <th>Retour effectif</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.map((emprunt) => {
              const status = getStatusInfo(emprunt.statut);
              return (
                <tr key={emprunt.id}>
                  <td>
                    <strong>{emprunt.livre.titre}</strong>
                    <br />
                    <small>{emprunt.livre.auteur}</small>
                  </td>
                  <td>{new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR')}</td>
                  <td>{new Date(emprunt.dateRetourPrevu).toLocaleDateString('fr-FR')}</td>
                  <td>
                    {emprunt.dateRetourEffectif
                      ? new Date(emprunt.dateRetourEffectif).toLocaleDateString('fr-FR')
                      : '-'}
                  </td>
                  <td>
                    <span className={`status ${status.className}`}>
                      <i className={`fas ${status.icon}`}></i>
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {emprunts.length === 0 && (
        <div className="empty-state">
          <p>Vous n&apos;avez pas encore d&apos;emprunt.</p>
          <Link to="/books" className="btn primary" style={{ marginTop: '1rem' }}>
            Parcourir le catalogue
          </Link>
        </div>
      )}
    </div>
  );
};

export default MesEmprunts;
