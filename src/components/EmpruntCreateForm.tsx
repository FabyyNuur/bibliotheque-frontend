import React, { useMemo } from "react";
import { Book } from "../types/Book";
import { User } from "../types/User";
import { isLecteur } from "../constants/roles";
import SearchableSelect from "./SearchableSelect";

export interface EmpruntFormState {
  utilisateurId: string;
  livreId: string;
  dureeEmprunt: number;
}

interface EmpruntCreateFormProps {
  form: EmpruntFormState;
  users: User[];
  books: Book[];
  onChange: (update: Partial<EmpruntFormState>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const EmpruntCreateForm: React.FC<EmpruntCreateFormProps> = ({
  form,
  users,
  books,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const lecteurOptions = useMemo(
    () =>
      users
        .filter((user) => user.actif && isLecteur(user.role))
        .map((user) => ({
          value: user.id,
          label: `${user.nom} ${user.prenom} (${user.email})`,
        })),
    [users]
  );

  const bookOptions = useMemo(
    () =>
      books.map((book) => ({
        value: book.id,
        label: `${book.titre} — ${book.auteur}`,
      })),
    [books]
  );

  return (
    <form onSubmit={onSubmit}>
      <SearchableSelect
        id="emprunt-user"
        label="Lecteur"
        placeholder="Rechercher un lecteur (nom, email)..."
        value={form.utilisateurId}
        onChange={(utilisateurId) => onChange({ utilisateurId })}
        options={lecteurOptions}
        required
        testId="emprunt-user-select"
      />

      <SearchableSelect
        id="emprunt-book"
        label="Livre"
        placeholder="Rechercher un livre (titre, auteur)..."
        value={form.livreId}
        onChange={(livreId) => onChange({ livreId })}
        options={bookOptions}
        required
        testId="emprunt-book-select"
      />

      <div className="form-group">
        <label htmlFor="emprunt-duree">Durée d&apos;emprunt (jours)</label>
        <input
          id="emprunt-duree"
          type="number"
          value={form.dureeEmprunt}
          onChange={(e) =>
            onChange({
              dureeEmprunt: parseInt(e.target.value, 10) || 14,
            })
          }
          min={1}
          max={30}
          required
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn primary btn-icon"
          data-testid="emprunt-create-submit"
        >
          <i className="fas fa-save"></i>
          Créer l&apos;emprunt
        </button>
        <button
          type="button"
          className="btn secondary btn-icon"
          onClick={onCancel}
          data-testid="emprunt-create-cancel"
        >
          <i className="fas fa-times"></i>
          Annuler
        </button>
      </div>
    </form>
  );
};

export default EmpruntCreateForm;
