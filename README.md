# Nuur Library Management System

Une application web moderne de gestion de bibliothèque développée avec React et TypeScript, offrant une interface intuitive pour la gestion des livres, utilisateurs et emprunts.

## Objectif du Projet

Ce système de gestion de bibliothèque permet aux bibliothécaires de :

- Gérer efficacement le catalogue de livres
- Administrer les comptes utilisateurs
- Suivre les emprunts et retours en temps réel
- Visualiser les statistiques de la bibliothèque

## Technologies Utilisées

### Frontend

- **React 19.1.0** - Framework JavaScript pour l'interface utilisateur
- **TypeScript 4.9.5** - Typage statique pour une meilleure robustesse du code
- **React Router DOM 7.7.0** - Navigation et routage côté client
- **Axios 1.10.0** - Client HTTP pour les appels API
- **Font Awesome 6.4.0** - Icônes professionnelles via CDN

### Développement & Outils

- **Create React App** - Configuration et outils de développement
- **CSS3** - Styling avec Flexbox, Grid et animations
- **ESLint** - Analyse statique du code
- **Jest & React Testing Library** - Tests unitaires

### Backend API

Ce frontend fonctionne avec une API REST développée séparément. L'API backend est disponible dans un repository séparé :

🔗 **Repository Backend** : [bibliotheque-api-impl](https://github.com/FabyyNuur/bibliotheque-api-impl)

**Caractéristiques de l'API :**

- **Architecture REST** - Endpoints structurés et logiques
- **Base de données** - Gestion persistante des données
- **CORS configuré** - Support des requêtes cross-origin
- **Validation des données** - Vérification des entrées utilisateur
- **Gestion d'erreurs** - Retours d'erreur structurés

**Configuration requise :**

- L'API doit tourner sur `http://localhost:3000/api` (par défaut)
- Ou configurer la variable d'environnement `REACT_APP_API_URL`

## Installation et Démarrage

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- L'API backend doit être démarrée (voir section Backend API)

### Installation Complète

#### 1. Installation du Backend (API)

```bash
# Cloner le repository du backend
git clone https://github.com/FabyyNuur/bibliotheque-api-impl.git

# Naviguer dans le dossier backend
cd bibliotheque-api-impl

# Installer les dépendances
npm install

# (Optionnel) Peupler le catalogue avec ~100 livres de démonstration
npm run seed:books

# Démarrer l'API backend en mode développement
npm run dev
```

L'API sera accessible sur `http://localhost:3000/api`

Au premier démarrage, un compte bibliothécaire est créé automatiquement (`admin@biblio.com` / `secret123`). Voir le README du backend pour les scripts `npm run seed` et `npm run seed:books`.

#### 2. Installation du Frontend

```bash
# Cloner le repository frontend
git clone https://github.com/FabyyNuur/bibliotheque-frontend.git

# Naviguer dans le dossier du projet
cd bibliotheque-frontend

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm start
```

L'application sera accessible sur [http://localhost:3001](http://localhost:3001)

**Note :** Le frontend se connecte automatiquement au backend sur le port 3000. Si vous utilisez un autre port pour l'API, créez un fichier `.env` dans le dossier frontend avec :

```
REACT_APP_API_URL=http://localhost:VOTRE_PORT/api
```

### Démarrage rapide (développement local)

```bash
# Terminal 1 — API
cd api-impl-biblio && npm install && npm run seed:books && npm run dev

# Terminal 2 — Frontend
cd bibliotheque-frontend && npm install && npm start
```

Connectez-vous avec le compte bibliothécaire par défaut (`admin@biblio.com` / `secret123`) pour accéder à toutes les fonctionnalités.

### Scripts Disponibles

```bash
npm start        # Démarrage en mode développement
npm run build    # Build de production
npm test         # Exécution des tests
npm run eject    # Éjection de Create React App (irréversible)
```

### Tests Selenium (UI navigateur)

Des tests E2E Selenium WebDriver sont disponibles dans `selenium-tests/`.

**Prérequis :** Java 17+, Maven 3.8+, Google Chrome, API + frontend démarrés

```bash
# API sur :3000, frontend sur :3001
./scripts/run-selenium.sh
# ou
cd selenium-tests && mvn test
```

Voir [selenium-tests/README.md](selenium-tests/README.md) pour plus de détails.

## Fonctionnalités Principales

### Dashboard

- **Vue d'ensemble** : Statistiques en temps réel de la bibliothèque
- **Métriques clés** :
  - Nombre total d'utilisateurs (actifs/inactifs)
  - Nombre total de livres (disponibles/empruntés)
  - Emprunts en cours et retournés
  - Emprunts en retard avec alertes visuelles
- **Actions rapides** : Boutons d'accès direct aux fonctions principales
- **Liste des livres récents** : Aperçu des derniers ajouts au catalogue

### Gestion des Utilisateurs

- **CRUD complet** : Créer, lire, modifier, supprimer des utilisateurs
- **Informations gérées** :
  - Nom, prénom, email
  - Date d'inscription
  - Statut (actif/inactif)
- **Fonctionnalités avancées** :
  - Création sans mot de passe : l'utilisateur reçoit un email avec ses identifiants
  - Redirection automatique vers `/change-password` à la première connexion
  - Activation/désactivation des comptes
  - Visualisation détaillée avec historique des emprunts
  - Modal d'information avec données complètes
  - Formatage intelligent des dates en français

### Gestion des Livres

- **Catalogue complet** : Interface en grille pour une meilleure visualisation
- **Informations gérées** :
  - Titre, auteur, ISBN
  - Genre, année de publication
  - Description optionnelle
  - Nombre d'exemplaires
  - Statut de disponibilité
- **Fonctionnalités** :
  - Recherche multi-critères (titre, auteur, genre)
  - Filtrage par disponibilité
  - Indicateurs visuels de statut avec icônes
  - Ajout/modification/suppression avec formulaires dynamiques

### Gestion des Emprunts

- **Suivi complet** : Liste détaillée de tous les emprunts
- **Informations affichées** :
  - Détails de l'utilisateur (nom, prénom, email)
  - Informations du livre (titre, auteur, ISBN)
  - Dates d'emprunt et de retour (prévue/effective)
  - Statut avec code couleur
- **Système de statuts** :
  - 🟢 **En cours** : Emprunt actif dans les délais
  - 🔴 **En retard** : Dépassement de la date de retour prévue
  - ✅ **Retourné** : Livre retourné avec succès
- **Fonctionnalités** :
  - Création de nouveaux emprunts
  - Gestion des retours
  - Alertes visuelles pour les retards

## Design et UX

### Système de Design

- **Palette de couleurs** : Thème orange et beige chaleureux
- **Typographie** : Police Segoe UI pour une lisibilité optimale
- **Icônes** : Font Awesome pour une interface professionnelle
- **Animations** : Transitions fluides et effets hover

### Interface Responsive

- **Mobile-first** : Optimisation pour tous les écrans
- **Navigation intuitive** : Menu de navigation fixe
- **Accessibilité** : Support clavier et lecteurs d'écran
- **Performance** : Chargement optimisé des ressources

### Composants Modernes

- **Badges de statut** : Avec dégradés et icônes
- **Boutons** : Design cohérent avec icônes Font Awesome
- **Modals** : Overlay subtil pour les détails
- **Formulaires** : Validation et feedback utilisateur

## Architecture du Code

### Architecture Système Complète

```
┌─────────────────────────────────┐    HTTP REST API    ┌─────────────────────────────────┐
│        FRONTEND (Port 3001)     │ ◄──────────────────► │      BACKEND API (Port 3000)   │
│                                 │                      │                                 │
│  React + TypeScript             │                      │  Node.js + Express (probable)   │
│  ├── Components/                │                      │  ├── Routes/                    │
│  ├── Services (Axios)           │                      │  ├── Controllers/               │
│  ├── Types/                     │                      │  ├── Models/                    │
│  └── Routing                    │                      │  └── Database                   │
│                                 │                      │                                 │
│  http://localhost:3001          │                      │  http://localhost:3000/api      │
└─────────────────────────────────┘                      └─────────────────────────────────┘
```

**Communication :**

- Le frontend fait des appels HTTP vers l'API backend
- Authentification et gestion de session (si implémentée)
- Échange de données au format JSON
- Gestion des erreurs avec codes de statut HTTP

### Structure des Dossiers Frontend

```
src/
├── components/          # Composants React
│   ├── Dashboard.tsx    # Tableau de bord principal
│   ├── UserList.tsx     # Gestion des utilisateurs
│   ├── BookList.tsx     # Gestion des livres
│   └── EmpruntList.tsx  # Gestion des emprunts
├── services/            # Services API
│   ├── apiClient.ts     # Configuration Axios
│   ├── userService.ts   # API utilisateurs
│   ├── bookService.ts   # API livres
│   └── empruntService.ts # API emprunts
├── types/               # Types TypeScript
│   ├── User.ts          # Interface utilisateur
│   ├── Book.ts          # Interface livre
│   └── Emprunt.ts       # Interface emprunt
└── App.tsx              # Composant principal avec routage
```

### Patterns Utilisés

- **Single Responsibility** : Chaque composant a une responsabilité unique
- **Type Safety** : TypeScript pour la sécurité des types
- **Service Layer** : Séparation de la logique API
- **Component Composition** : Réutilisabilité des composants
- **State Management** : useState et useEffect pour la gestion d'état

## Fonctionnalités Techniques

### Gestion des États

- **État local** : useState pour les données de composant
- **Effets** : useEffect pour les appels API et cycles de vie
- **Formulaires** : Gestion des états de formulaire avec validation

### Appels API

- **Client HTTP** : Axios avec configuration centralisée
- **Gestion d'erreurs** : Try-catch avec messages utilisateur
- **Loading States** : Indicateurs de chargement

### Navigation

- **React Router** : Navigation côté client
- **Routes protégées** : Structure prête pour l'authentification
- **Navigation active** : Indicateurs visuels de page active

## Fonctionnalités Implémentées

### Interface Utilisateur

- ✅ Design responsive avec thème personnalisé
- ✅ Navigation avec React Router
- ✅ Icônes Font Awesome intégrées
- ✅ Animations et transitions CSS
- ✅ Modals pour les détails utilisateur
- ✅ Formulaires dynamiques avec validation

### Gestion des Données

- ✅ Services API avec Axios
- ✅ Types TypeScript pour toutes les entités
- ✅ Gestion d'état local avec React Hooks
- ✅ Formatage des dates en français
- ✅ Gestion des erreurs utilisateur

### Fonctionnalités Métier

- ✅ CRUD complet pour utilisateurs, livres et emprunts
- ✅ Système de statuts avec indicateurs visuels
- ✅ Recherche et filtrage
- ✅ Calcul automatique des retards
- ✅ Statistiques en temps réel
- ✅ Historique des emprunts par utilisateur

## Améliorations Futures

- [X] **Backend API REST complet** - ✅ Implémenté dans [bibliotheque-api-impl](https://github.com/FabyyNuur/bibliotheque-api-impl)
- [X] **Authentification et autorisation** - ✅ Connexion JWT avec rôles bibliothécaire / lecteur
- [ ] Système de notifications en temps réel
- [ ] Export de données (PDF, Excel)
- [ ] Historique des actions utilisateur
- [ ] Tests unitaires et d'intégration
- [ ] Déploiement en production (Docker + CI/CD)
- [ ] PWA (Progressive Web App)
- [ ] Thèmes personnalisables
- [ ] Mode hors ligne

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commiter vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pusher vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Développeur

**Nuur Faby** - Développeur Full Stack

- GitHub: [@FabyyNuur](https://github.com/FabyyNuur)

### Repositories du Projet

Ce projet est composé de deux repositories distincts :

📋 **Frontend** : [bibliotheque-frontend](https://github.com/FabyyNuur/bibliotheque-frontend) - Interface utilisateur React/TypeScript
🔧 **Backend API** : [bibliotheque-api-impl](https://github.com/FabyyNuur/bibliotheque-api-impl) - API REST pour la gestion des données

*Développé avec ❤️ pour moderniser la gestion des bibliothèques*
