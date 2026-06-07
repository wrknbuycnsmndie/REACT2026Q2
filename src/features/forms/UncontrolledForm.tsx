import { type FormEventHandler, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { selectCountries } from '../submissions/submissionsSlice';
import { genderOptions, isGender, type FormProps } from './formTypes';
import { fileToBase64, getImageError } from './imageUtils';
import { PasswordStrength } from './PasswordStrength';
import './forms.css';

export function UncontrolledForm({ onSubmit }: FormProps) {
  const countries = useAppSelector(selectCountries);
  const [password, setPassword] = useState('');
  const [imageError, setImageError] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const gender = formData.get('gender');
    const imageInput = form.elements.namedItem('image');
    const image = imageInput instanceof HTMLInputElement ? imageInput.files?.[0] : undefined;

    if (!isGender(gender) || !image) {
      return;
    }

    const error = getImageError(image);
    setImageError(error ?? '');

    if (error) return;

    onSubmit({
      name: String(formData.get('name')),
      age: Number(formData.get('age')),
      email: String(formData.get('email')),
      gender,
      acceptedTerms: formData.has('acceptedTerms'),
      password: String(formData.get('password')),
      confirmPassword: String(formData.get('confirmPassword')),
      country: String(formData.get('country')),
      image: await fileToBase64(image),
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
      <Input
        accept='image/jpeg,image/png'
        id='uncontrolled-image'
        label='Profile image'
        name='image'
        type='file'
      />
      <p className='field-message'>{imageError}</p>
      <Input
        id='uncontrolled-password'
        label='Password'
        name='password'
        onChange={(event) => setPassword(event.currentTarget.value)}
        type='password'
      />
      <PasswordStrength password={password} />
      <Input
        id='uncontrolled-confirm-password'
        label='Confirm password'
        name='confirmPassword'
        type='password'
      />
      <Input
        id='uncontrolled-country'
        label='Country'
        list='uncontrolled-country-list'
        name='country'
        type='text'
      />
      <datalist id='uncontrolled-country-list'>
        {countries.map((country) => (
          <option key={country} value={country} />
        ))}
      </datalist>
      <button className='button button--primary' type='submit'>
        Submit
      </button>
    </form>
  );
}
