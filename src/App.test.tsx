import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from './context/AuthContext';
import App from './App';

test('affiche le titre de la bibliothèque', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const titleElement = screen.getByText(/Nuur Library Management/i);
  expect(titleElement).toBeInTheDocument();
});
