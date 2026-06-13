import type { FormSubmission, Gender } from '../submissions/submissionTypes';

type SubmissionFields = Pick<
  FormSubmission,
  'name' | 'age' | 'email' | 'gender' | 'acceptedTerms' | 'country' | 'image'
>;

type PasswordFields = {
  password: string;
  confirmPassword: string;
};

export type FormValues = SubmissionFields & PasswordFields;

export interface FormProps {
  onSubmit: (data: FormValues) => void;
}

export const genderOptions = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Other', value: 'other' },
];

export function isGender(value: FormDataEntryValue | null): value is Gender {
  return value === 'female' || value === 'male' || value === 'other';
}
