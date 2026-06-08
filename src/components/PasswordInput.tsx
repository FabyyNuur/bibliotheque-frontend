import React, { useState } from 'react';

interface PasswordInputProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  minLength,
  autoComplete,
}) => {
  const [visible, setVisible] = useState(false);

  const field = (
    <div className="password-input-field">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        tabIndex={-1}
      >
        <i className={`fas ${visible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
      </button>
    </div>
  );

  if (label) {
    return (
      <div className="form-group password-input-group">
        <label htmlFor={id}>{label}</label>
        {field}
      </div>
    );
  }

  return field;
};

export default PasswordInput;
