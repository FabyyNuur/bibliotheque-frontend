import React, { useEffect, useMemo, useRef, useState } from "react";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  required?: boolean;
  disabled?: boolean;
  testId?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  label,
  placeholder = "Rechercher...",
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  testId,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery)
    );
  }, [options, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
    setQuery("");
  };

  const inputValue = open ? query : selected?.label ?? "";

  return (
    <div
      className="form-group searchable-select"
      ref={containerRef}
      data-testid={testId}
    >
      <label htmlFor={id}>{label}</label>
      <div className="searchable-select-control">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder}
          value={inputValue}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (value) onChange("");
          }}
          onFocus={() => {
            setOpen(true);
            if (!value) setQuery("");
          }}
          data-testid={testId ? `${testId}-search` : undefined}
        />
        {selected && !open && (
          <button
            type="button"
            className="searchable-select-clear"
            onClick={() => onChange("")}
            aria-label="Effacer la sélection"
            tabIndex={-1}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      <input
        tabIndex={-1}
        aria-hidden
        className="searchable-select-hidden"
        value={value}
        onChange={() => undefined}
        required={required}
      />
      {open && (
        <ul className="searchable-select-list" role="listbox">
          {filteredOptions.length === 0 ? (
            <li className="searchable-select-empty">Aucun résultat</li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={`searchable-select-option${
                  option.value === value ? " selected" : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(option.value)}
                data-testid={
                  testId ? `${testId}-option-${option.value}` : undefined
                }
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
