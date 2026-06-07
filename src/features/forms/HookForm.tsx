import { useForm, useWatch } from 'react-hook-form';
import { useAppSelector } from '../../app/hooks';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { selectCountries } from '../submissions/submissionsSlice';
import { genderOptions, type FormProps, type FormValues } from './formTypes';
import { fileToBase64, getImageError } from './imageUtils';
import { PasswordStrength } from './PasswordStrength';
import './forms.css';

interface HookFormData extends Omit<FormValues, 'image'> {
  image: FileList;
}

export function HookForm({ onSubmit }: FormProps) {
  const countries = useAppSelector(selectCountries);
  const { control, handleSubmit, register, setError, formState } =
    useForm<HookFormData>();
  const password = useWatch({ control, name: 'password', defaultValue: '' });

  async function submitForm(data: HookFormData) {
    const image = data.image.item(0);

    if (!image) return;

    const error = getImageError(image);
    if (error) {
      setError('image', { message: error });
      return;
    }

    onSubmit({ ...data, image: await fileToBase64(image) });
  }

  return (
    <form className='user-form' onSubmit={handleSubmit(submitForm)}>
      <Input id='hook-name' label='Name' type='text' {...register('name')} />
      <Input
        id='hook-age'
        label='Age'
        type='number'
        {...register('age', { valueAsNumber: true })}
      />
      <Input
        id='hook-email'
        label='Email'
        type='email'
        {...register('email')}
      />
      <Select
        id='hook-gender'
        label='Gender'
        options={genderOptions}
        placeholder='Select gender'
        {...register('gender')}
      />
      <Checkbox
        id='hook-terms'
        label='I accept the Terms and Conditions'
        {...register('acceptedTerms')}
      />
      <Input
        accept='image/jpeg,image/png'
        id='hook-image'
        label='Profile image'
        type='file'
        {...register('image')}
      />
      <p className='field-message'>{formState.errors.image?.message}</p>
      <Input
        id='hook-password'
        label='Password'
        type='password'
        {...register('password')}
      />
      <PasswordStrength password={password} />
      <Input
        id='hook-confirm-password'
        label='Confirm password'
        type='password'
        {...register('confirmPassword')}
      />
      <Input
        id='hook-country'
        label='Country'
        list='hook-country-list'
        type='text'
        {...register('country')}
      />
      <datalist id='hook-country-list'>
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
