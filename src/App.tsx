import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import UserList from "./components/UserList";
import BookList from "./components/BookList";
import EmpruntList from "./components/EmpruntList";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import MesEmprunts from "./components/MesEmprunts";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePassword from "./components/ChangePassword";

function AppContent() {
  const { isAuthenticated, isBibliothecaire, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading app-loading">Chargement...</div>;
  }

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-title">Nuur Library Management</h1>
          <ul className="nav-menu">
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/books" className="nav-link">
                    Livres
                  </Link>
                </li>
                {isBibliothecaire ? (
                  <>
                    <li>
                      <Link to="/users" className="nav-link">
                        Utilisateurs
                      </Link>
                    </li>
                    <li>
                      <Link to="/emprunts" className="nav-link">
                        Emprunts
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/mes-emprunts" className="nav-link">
                        Mes emprunts
                      </Link>
                    </li>
                    <li>
                      <Link to="/profil" className="nav-link">
                        Profil
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-user">
                  <button className="btn small secondary btn-icon" onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/books" className="nav-link">
                    Catalogue
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="nav-link">
                    Connexion
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Navigate to="/login" replace />} />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="/books" element={<BookList />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requireBibliothecaire>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emprunts"
            element={
              <ProtectedRoute requireBibliothecaire>
                <EmpruntList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mes-emprunts"
            element={
              <ProtectedRoute>
                <MesEmprunts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
