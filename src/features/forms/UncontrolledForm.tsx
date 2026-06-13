import { type FormEventHandler, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { selectCountries } from '../submissions/submissionsSlice';
import { genderOptions, type FormProps } from './formTypes';
import { createFormSchema, getFormErrors, type FormErrors } from './formSchema';
import { fileToBase64 } from './imageUtils';
import { PasswordStrength } from './PasswordStrength';
import './forms.css';

export function UncontrolledForm({ onSubmit }: FormProps) {
  const countries = useAppSelector(selectCountries);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const age = String(formData.get('age'));
    const imageInput = form.elements.namedItem('image');
    const imageFiles = imageInput instanceof HTMLInputElement ? imageInput.files : null;
    const result = createFormSchema(countries).safeParse({
      name: String(formData.get('name')),
      age: age === '' ? Number.NaN : Number(age),
      email: String(formData.get('email')),
      gender: formData.get('gender'),
      acceptedTerms: formData.has('acceptedTerms'),
      password: String(formData.get('password')),
      confirmPassword: String(formData.get('confirmPassword')),
      country: String(formData.get('country')),
      image: imageFiles,
    });

    if (!result.success) {
      setErrors(getFormErrors(result.error));
      return;
    }

    setErrors({});
    const image = result.data.image.item(0)!;

    onSubmit({
      ...result.data,
      image: await fileToBase64(image),
    });
  };

  return (
    <form className='user-form' noValidate onSubmit={handleSubmit}>
      <Input
        error={errors.name}
        id='uncontrolled-name'
        label='Name'
        name='name'
        type='text'
      />
      <Input
        error={errors.age}
        id='uncontrolled-age'
        label='Age'
        name='age'
        type='number'
      />
      <Input
        error={errors.email}
        id='uncontrolled-email'
        inputMode='email'
        label='Email'
        name='email'
        type='text'
      />
      <Select
        error={errors.gender}
        id='uncontrolled-gender'
        label='Gender'
        name='gender'
        options={genderOptions}
        placeholder='Select gender'
      />
      <Checkbox
        error={errors.acceptedTerms}
        id='uncontrolled-terms'
        label='I accept the Terms and Conditions'
        name='acceptedTerms'
      />
      <Input
        accept='image/jpeg,image/png'
        error={errors.image}
        id='uncontrolled-image'
        label='Profile image'
        name='image'
        type='file'
      />
      <Input
        error={errors.password}
        id='uncontrolled-password'
        label='Password'
        name='password'
        onChange={(event) => setPassword(event.currentTarget.value)}
        type='password'
      />
      <PasswordStrength password={password} />
      <Input
        error={errors.confirmPassword}
        id='uncontrolled-confirm-password'
        label='Confirm password'
        name='confirmPassword'
        type='password'
      />
      <Input
        error={errors.country}
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
