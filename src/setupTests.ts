import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';

beforeEach(() => {
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.append(modalRoot);
});

afterEach(() => {
  document.getElementById('modal-root')?.remove();
});
