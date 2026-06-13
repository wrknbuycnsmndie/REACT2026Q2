import type { ComponentProps } from 'react';
import './Input.css';

interface InputProps extends ComponentProps<'input'> {
  error?: string;
  label: string;
}

export function Input({ error, id, label, ...props }: InputProps) {
  const errorId = `${id}-error`;

  return (
    <div className='input-field'>
      <label htmlFor={id}>{label}</label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        id={id}
        {...props}
      />
      {error && (
        <p className='field-error' id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
