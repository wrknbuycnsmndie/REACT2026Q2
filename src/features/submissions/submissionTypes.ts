export type FormSource = 'uncontrolled' | 'react-hook-form';
export type Gender = 'female' | 'male' | 'other';

export interface FormSubmission {
  id: string;
  source: FormSource;
  name: string;
  age: number;
  email: string;
  gender: Gender;
  acceptedTerms: boolean;
  country: string;
  image: string;
  submittedAt: string;
}
