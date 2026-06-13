export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const allowedImageTypes = ['image/jpeg', 'image/png'];
const allowedImageExtensions = ['.jpg', '.jpeg', '.png'];

export function getImageError(file: File): string | null {
  const fileName = file.name.toLowerCase();
  const hasAllowedExtension = allowedImageExtensions.some((extension) =>
    fileName.endsWith(extension),
  );

  if (!allowedImageTypes.includes(file.type) || !hasAllowedExtension) {
    return 'Choose a PNG or JPEG image.';
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image must be 2 MB or smaller.';
  }

  return null;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => resolve(String(reader.result)));
    reader.addEventListener('error', () => reject(new Error('Could not read the image.')));
    reader.readAsDataURL(file);
  });
}
