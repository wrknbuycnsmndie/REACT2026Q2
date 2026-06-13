import { describe, expect, it } from 'vitest';
import { getPasswordStrength } from './passwordUtils';

describe('getPasswordStrength', () => {
  it('reports every satisfied password requirement', () => {
    expect(getPasswordStrength('Password1!')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialCharacter: true,
    });
  });

  it('reports every missing password requirement', () => {
    expect(getPasswordStrength('')).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: false,
      hasSpecialCharacter: false,
    });
  });

  it.each([
    ['123', 'hasNumber'],
    ['ABC', 'hasUppercase'],
    ['abc', 'hasLowercase'],
    ['!@#', 'hasSpecialCharacter'],
  ] as const)('detects %s independently', (password, requirement) => {
    const strength = getPasswordStrength(password);

    expect(strength[requirement]).toBe(true);
    expect(Object.values(strength).filter(Boolean)).toHaveLength(1);
  });
});
