export const USER_ROLES = {
  BIBLIOTHECAIRE: 'BIBLIOTHECAIRE',
  LECTEUR: 'LECTEUR',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const isBibliothecaire = (role: UserRole): boolean =>
  role === USER_ROLES.BIBLIOTHECAIRE;

export const isLecteur = (role: UserRole): boolean =>
  role === USER_ROLES.LECTEUR;

export const getRoleLabel = (role: UserRole): string =>
  isBibliothecaire(role) ? 'Bibliothécaire' : 'Lecteur';
