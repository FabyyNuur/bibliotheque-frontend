export interface Emprunt {
  id: string;
  utilisateurId: string;
  livreId: string;
  dateEmprunt: string;
  dateRetourPrevu: string;
  dateRetourEffectif?: string;
  statut: 'EN_COURS' | 'RETOURNE' | 'EN_RETARD';
}

export interface CreateEmpruntRequest {
  livreId: string;
  utilisateurId?: string;
  dureeEmprunt?: number;
}

export interface EmpruntAvecDetails extends Emprunt {
  utilisateur: {
    nom: string;
    prenom: string;
    email: string;
  };
  livre: {
    titre: string;
    auteur: string;
    isbn: string;
    nombreExemplaires: number;
  };
}
