import type { ComponentProps } from 'react';
import './Checkbox.css';

interface CheckboxProps extends ComponentProps<'input'> {
  label: string;
}

export function Checkbox({ id, label, ...props }: CheckboxProps) {
  return (
    <div className='checkbox-field'>
      <input id={id} type='checkbox' {...props} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
