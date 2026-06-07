import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useAppSelector } from '../../app/hooks';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { selectCountries } from '../submissions/submissionsSlice';
import { genderOptions, type FormProps } from './formTypes';
import { createFormSchema, type FormInput } from './formSchema';
import { fileToBase64 } from './imageUtils';
import { PasswordStrength } from './PasswordStrength';
import './forms.css';

export function HookForm({ onSubmit }: FormProps) {
  const countries = useAppSelector(selectCountries);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<FormInput>({
    resolver: zodResolver(createFormSchema(countries)),
    mode: 'onChange',
  });
  const password = useWatch({ control, name: 'password', defaultValue: '' });

  async function submitForm(data: FormInput) {
    const image = data.image.item(0)!;
    onSubmit({ ...data, image: await fileToBase64(image) });
  }

  return (
    <form className='user-form' noValidate onSubmit={handleSubmit(submitForm)}>
      <Input
        error={errors.name?.message}
        id='hook-name'
        label='Name'
        type='text'
        {...register('name')}
      />
      <Input
        error={errors.age?.message}
        id='hook-age'
        label='Age'
        type='number'
        {...register('age', { valueAsNumber: true })}
      />
      <Input
        error={errors.email?.message}
        id='hook-email'
        label='Email'
        inputMode='email'
        type='text'
        {...register('email')}
      />
      <Select
        error={errors.gender?.message}
        id='hook-gender'
        label='Gender'
        options={genderOptions}
        placeholder='Select gender'
        {...register('gender')}
      />
      <Checkbox
        error={errors.acceptedTerms?.message}
        id='hook-terms'
        label='I accept the Terms and Conditions'
        {...register('acceptedTerms')}
      />
      <Input
        accept='image/jpeg,image/png'
        error={errors.image?.message}
        id='hook-image'
        label='Profile image'
        type='file'
        {...register('image')}
      />
      <Input
        error={errors.password?.message}
        id='hook-password'
        label='Password'
        type='password'
        {...register('password')}
      />
      <PasswordStrength password={password} />
      <Input
        error={errors.confirmPassword?.message}
        id='hook-confirm-password'
        label='Confirm password'
        type='password'
        {...register('confirmPassword')}
      />
      <Input
        error={errors.country?.message}
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
      <button className='button button--primary' disabled={!isValid} type='submit'>
        Submit
      </button>
    </form>
  );
}
