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

  it('stores and displays a completed form', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'React Hook Form' }));
    await user.type(screen.getByLabelText('Name'), 'Alice');
    await user.type(screen.getByLabelText('Age'), '30');
    await user.type(screen.getByLabelText('Email'), 'alice@example.com');
    await user.selectOptions(screen.getByLabelText('Gender'), 'female');
    await user.click(screen.getByLabelText('I accept the Terms and Conditions'));
    await user.upload(
      screen.getByLabelText('Profile image'),
      new File(['image'], 'avatar.png', { type: 'image/png' }),
    );
    await user.type(screen.getByLabelText('Password'), 'Password1!');
    await user.type(screen.getByLabelText('Confirm password'), 'Password1!');
    await user.type(screen.getByLabelText('Country'), 'Canada');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByRole('heading', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Alice profile' })).toHaveAttribute(
      'src',
      expect.stringMatching(/^data:image/),
    );

    await user.click(screen.getByRole('button', { name: 'React Hook Form' }));

    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');
  });
});
