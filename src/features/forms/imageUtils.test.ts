import { afterEach, describe, expect, it, vi } from 'vitest';
import { fileToBase64, getImageError, MAX_IMAGE_SIZE } from './imageUtils';

describe('getImageError', () => {
  it.each([
    ['avatar.png', 'image/png'],
    ['avatar.jpg', 'image/jpeg'],
    ['avatar.jpeg', 'image/jpeg'],
  ])('accepts a valid %s image', (name, type) => {
    expect(getImageError(new File(['image'], name, { type }))).toBeNull();
  });

  it('rejects an unsupported MIME type', () => {
    const image = new File(['image'], 'avatar.gif', { type: 'image/gif' });

    expect(getImageError(image)).toBe('Choose a PNG or JPEG image.');
  });

  it('rejects an unsupported extension even with a valid MIME type', () => {
    const image = new File(['image'], 'avatar.gif', { type: 'image/png' });

    expect(getImageError(image)).toBe('Choose a PNG or JPEG image.');
  });

  it('rejects an image above the size limit', () => {
    const image = new File([new Uint8Array(MAX_IMAGE_SIZE + 1)], 'avatar.png', {
      type: 'image/png',
    });

    expect(getImageError(image)).toBe('Image must be 2 MB or smaller.');
  });
});

describe('fileToBase64', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('converts a file to a base64 data URL', async () => {
    const image = new File(['image'], 'avatar.png', { type: 'image/png' });

    await expect(fileToBase64(image)).resolves.toBe('data:image/png;base64,aW1hZ2U=');
  });

  it('rejects when FileReader cannot read the file', async () => {
    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function (
      this: FileReader,
    ) {
      this.dispatchEvent(new ProgressEvent('error'));
    });

    const image = new File(['image'], 'avatar.png', { type: 'image/png' });

    await expect(fileToBase64(image)).rejects.toThrow('Could not read the image.');
  });
});
