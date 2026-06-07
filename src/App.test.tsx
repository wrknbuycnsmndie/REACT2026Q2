import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App form launchers', () => {
  it.each([
    ['Uncontrolled form', 'Uncontrolled form'],
    ['React Hook Form', 'React Hook Form'],
  ] as const)('opens the reusable modal from %s', async (launcherName, dialogName) => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: launcherName }));

    expect(screen.getByRole('dialog', { name: dialogName })).toBeInTheDocument();
  });
});
