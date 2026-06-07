import type { FormSubmission, Gender } from '../submissions/submissionTypes';

export type BasicSubmissionData = Pick<
  FormSubmission,
  'name' | 'age' | 'email' | 'gender' | 'acceptedTerms'
>;

export interface FormProps {
  onSubmit?: (data: BasicSubmissionData) => void;
}

export const genderOptions = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Other', value: 'other' },
];

export function isGender(value: FormDataEntryValue | null): value is Gender {
  return value === 'female' || value === 'male' || value === 'other';
}
