import type { FormEventHandler } from 'react';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { genderOptions, isGender, type FormProps } from './formTypes';
import './forms.css';

export function UncontrolledForm({ onSubmit }: FormProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const gender = formData.get('gender');

    if (!isGender(gender)) {
      return;
    }

    onSubmit?.({
      name: String(formData.get('name')),
      age: Number(formData.get('age')),
      email: String(formData.get('email')),
      gender,
      acceptedTerms: formData.has('acceptedTerms'),
    });
  };

  return (
    <form className='user-form' onSubmit={handleSubmit}>
      <Input id='uncontrolled-name' label='Name' name='name' type='text' />
      <Input id='uncontrolled-age' label='Age' name='age' type='number' />
      <Input id='uncontrolled-email' label='Email' name='email' type='email' />
      <Select
        id='uncontrolled-gender'
        label='Gender'
        name='gender'
        options={genderOptions}
        placeholder='Select gender'
      />
      <Checkbox
        id='uncontrolled-terms'
        label='I accept the Terms and Conditions'
        name='acceptedTerms'
      />
      <button className='button button--primary' type='submit'>
        Submit
      </button>
    </form>
  );
}
