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

  useEffect(() => {
    loadDashboardData();
  }, []);

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
          <button className="action-btn primary">➕ Ajouter un livre</button>
          <button className="action-btn secondary">
            👤 Nouveau utilisateur
          </button>
          <button className="action-btn tertiary">📋 Nouvel emprunt</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
