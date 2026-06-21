import '@testing-library/jest-dom/vitest';
import { resetMockUrl } from './__tests__/testUtils/nextMocks';
import { afterEach, vi } from 'vitest';

afterEach(() => {
    resetMockUrl();
    vi.restoreAllMocks();
});
