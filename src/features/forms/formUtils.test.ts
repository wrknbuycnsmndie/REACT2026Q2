import { describe, expect, it } from 'vitest';
import { getImageError, MAX_IMAGE_SIZE } from './imageUtils';
import { getPasswordStrength } from './passwordUtils';

describe('image utilities', () => {
  it('accepts PNG and JPEG files within the size limit', () => {
    expect(getImageError(new File(['image'], 'avatar.png', { type: 'image/png' }))).toBeNull();
    expect(getImageError(new File(['image'], 'avatar.jpg', { type: 'image/jpeg' }))).toBeNull();
  });

  it('rejects unsupported and oversized files', () => {
    expect(getImageError(new File(['image'], 'avatar.gif', { type: 'image/gif' }))).toBe(
      'Choose a PNG or JPEG image.',
    );
    expect(
      getImageError(new File([new Uint8Array(MAX_IMAGE_SIZE + 1)], 'avatar.png', {
        type: 'image/png',
      })),
    ).toBe('Image must be 2 MB or smaller.');
  });
});

describe('password utilities', () => {
  it('reports each password requirement', () => {
    expect(getPasswordStrength('Password1!')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialCharacter: true,
    });
  });
});
