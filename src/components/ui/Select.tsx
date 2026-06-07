import type { ComponentProps } from 'react';
import './Select.css';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends ComponentProps<'select'> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ id, label, options, placeholder, ...props }: SelectProps) {
  return (
    <div className='select-field'>
      <label htmlFor={id}>{label}</label>
      <select id={id} {...props}>
        {placeholder && <option value=''>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
