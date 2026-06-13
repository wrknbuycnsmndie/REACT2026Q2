import { z } from 'zod';
import { getImageError } from './imageUtils';

function isBasicEmail(email: string) {
  const parts = email.split('@');

  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  return Boolean(
    localPart && domain && domain.includes('.') && !domain.startsWith('.'),
  );
}

function startsWithUppercaseLetter(name: string) {
  const firstCharacter = name.charAt(0);
  return (
    firstCharacter.length > 0 &&
    firstCharacter === firstCharacter.toUpperCase() &&
    firstCharacter !== firstCharacter.toLowerCase()
  );
}

export function createFormSchema(countries: readonly string[]) {
  return z
    .object({
      name: z
        .string()
        .refine(
          startsWithUppercaseLetter,
          'Name must start with an uppercase letter.',
        ),
      age: z
        .number({ error: 'Enter a valid age.' })
        .min(0, 'Age cannot be negative.')
        .max(100, 'Are you kidding me?'),
      email: z.string().refine(isBasicEmail, 'Enter a valid email address.'),
      gender: z.enum(['female', 'male', 'other'], {
        message: 'Select a gender.',
      }),
      acceptedTerms: z.literal(true, {
        message: 'Accept the Terms and Conditions.',
      }),
      image: z
        .custom<FileList>(
          (value) => value instanceof FileList && value.length > 0,
          {
            message: 'Choose an image.',
          },
        )
        .superRefine((files, context) => {
          const image = files.item(0);
          if (!image) return;

          const imageError = getImageError(image);
          if (imageError) {
            context.addIssue({ code: 'custom', message: imageError });
          }
        }),
      password: z.string().min(1, 'Enter a password.'),
      confirmPassword: z.string().min(1, 'Confirm your password.'),
      country: z
        .string()
        .refine(
          (country) => countries.includes(country),
          'Select a listed country.',
        ),
    })
    .superRefine((values, context) => {
      if (values.password !== values.confirmPassword) {
        context.addIssue({
          code: 'custom',
          message: 'Passwords must match.',
          path: ['confirmPassword'],
        });
      }
    });
}

export type FormInput = z.infer<ReturnType<typeof createFormSchema>>;

export type FormErrors = Partial<Record<keyof FormInput, string>>;

export function getFormErrors(error: z.ZodError<FormInput>): FormErrors {
  const errors: FormErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === 'string' && !(field in errors)) {
      errors[field as keyof FormInput] = issue.message;
    }
  }

  return errors;
}
