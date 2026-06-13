import type { ComponentProps } from 'react';
import './Checkbox.css';

interface CheckboxProps extends ComponentProps<'input'> {
  error?: string;
  label: string;
}

export function Checkbox({ error, id, label, ...props }: CheckboxProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <div className='checkbox-field'>
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          id={id}
          type='checkbox'
          {...props}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && (
        <p className='field-error' id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
