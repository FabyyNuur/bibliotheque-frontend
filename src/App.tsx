import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import UserList from "./components/UserList";
import BookList from "./components/BookList";
import EmpruntList from "./components/EmpruntList";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">📚 Bibliothèque Management</h1>
            <ul className="nav-menu">
              <li>
                <Link to="/" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/users" className="nav-link">
                  Utilisateurs
                </Link>
              </li>
              <li>
                <Link to="/books" className="nav-link">
                  Livres
                </Link>
              </li>
              <li>
                <Link to="/emprunts" className="nav-link">
                  Emprunts
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/emprunts" element={<EmpruntList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
