import { useForm } from 'react-hook-form';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { genderOptions, type BasicSubmissionData, type FormProps } from './formTypes';
import './forms.css';

export function HookForm({ onSubmit }: FormProps) {
  const { handleSubmit, register } = useForm<BasicSubmissionData>();

  return (
    <form className='user-form' onSubmit={handleSubmit((data) => onSubmit?.(data))}>
      <Input id='hook-name' label='Name' type='text' {...register('name')} />
      <Input
        id='hook-age'
        label='Age'
        type='number'
        {...register('age', { valueAsNumber: true })}
      />
      <Input id='hook-email' label='Email' type='email' {...register('email')} />
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
      <button className='button button--primary' type='submit'>
        Submit
      </button>
    </form>
  );
}
