import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import App from './App';
import { submissionsReducer } from './features/submissions/submissionsSlice';

function renderApp() {
  const store = configureStore({ reducer: { submissions: submissionsReducer } });

  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

describe('App form launchers', () => {
  it.each([
    ['Uncontrolled form', 'Uncontrolled form'],
    ['React Hook Form', 'React Hook Form'],
  ] as const)('opens the reusable modal from %s', async (launcherName, dialogName) => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: launcherName }));

    expect(screen.getByRole('dialog', { name: dialogName })).toBeInTheDocument();
  });
});
