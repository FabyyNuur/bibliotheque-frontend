import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  preparing?: boolean;
  testId?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  loading = false,
  preparing = false,
  testId = "confirm-modal",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={loading || preparing ? undefined : onCancel}
      data-testid={testId}
    >
      <div
        className="modal-content confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{title}</h3>
        {preparing ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="confirm-modal-message">{message}</div>
        )}
        <div className="form-actions">
          <button
            type="button"
            className="btn secondary btn-icon"
            onClick={onCancel}
            disabled={loading || preparing}
            data-testid="confirm-modal-cancel"
          >
            <i className="fas fa-times"></i>
            {cancelLabel}
          </button>
          {!preparing && (
            <button
              type="button"
              className="btn danger btn-icon"
              onClick={onConfirm}
              disabled={loading}
              data-testid="confirm-modal-confirm"
            >
              <i className="fas fa-check"></i>
              {loading ? "En cours..." : confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
