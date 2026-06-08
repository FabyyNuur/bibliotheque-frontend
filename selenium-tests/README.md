# Tests UI Selenium

Tests end-to-end navigateur pour l'application React, avec Selenium WebDriver, JUnit 5 et le pattern Page Object Model.

## Prérequis

- Java 17+
- Maven 3.8+
- Google Chrome
- API backend sur `http://localhost:3000`
- Frontend sur `http://localhost:3001`

## Lancement

```bash
# Terminal 1 — API
cd ../api-impl-biblio && npm run dev

# Terminal 2 — Frontend
cd .. && npm start

# Terminal 3 — Selenium
mvn test

# Ou via le script (vérifie API + frontend)
../scripts/run-selenium.sh

# Mode visible (navigateur affiché)
mvn test -Dheadless=false
```

## Compte de test

- Email : `admin@biblio.com`
- Mot de passe : `secret123`

## Structure

```
src/test/java/com/biblio/selenium/
├── config/          # WebDriver, TestConfig
├── pages/           # Page Object Model
├── tests/           # Suites JUnit
└── utils/           # Attentes, données de test
```

## Suites de tests

| Classe | Couverture |
|--------|------------|
| `SmokeTest` | Catalogue public, navbar |
| `AuthTest` | Login, logout, création compte par biblio |
| `LecteurFlowTest` | Emprunt, profil |
| `BibliothecaireFlowTest` | CRUD livre, utilisateurs, emprunts |
| `RbacTest` | Accès refusé par rôle |
| `ErrorHandlingTest` | Recherche vide, validations |
