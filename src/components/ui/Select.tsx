import type { ComponentProps } from 'react';
import './Select.css';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends ComponentProps<'select'> {
  error?: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ error, id, label, options, placeholder, ...props }: SelectProps) {
  const errorId = `${id}-error`;

  return (
    <div className='select-field'>
      <label htmlFor={id}>{label}</label>
      <select
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        id={id}
        {...props}
      >
        {placeholder && <option value=''>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className='field-error' id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
