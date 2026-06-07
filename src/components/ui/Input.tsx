import type { ComponentProps } from 'react';
import './Input.css';

interface InputProps extends ComponentProps<'input'> {
  label: string;
}

export function Input({ id, label, ...props }: InputProps) {
  return (
    <div className='input-field'>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </div>
  );
}
