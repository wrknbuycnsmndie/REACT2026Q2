import { getPasswordStrength } from './passwordUtils';

interface PasswordStrengthProps {
  password: string;
}

const requirements = [
  ['hasNumber', 'One number'],
  ['hasUppercase', 'One uppercase letter'],
  ['hasLowercase', 'One lowercase letter'],
  ['hasSpecialCharacter', 'One special character'],
] as const;

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getPasswordStrength(password);

  return (
    <div className='password-strength'>
      <p className='password-strength__title'>Password should contain:</p>
      <div
        className='password-strength__list'
        aria-label='Password requirements'
      >
        {requirements.map(([key, label]) => {
          const isMet = strength[key];

          return (
            <p
              className={isMet ? 'password-strength__item--met' : ''}
              key={key}
            >
              <span aria-hidden='true' className='password-strength__marker'>
                {isMet ? '✓' : ''}
              </span>
              {label}
            </p>
          );
        })}
      </div>
    </div>
  );
}
