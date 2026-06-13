import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import { submissionsReducer } from '../submissions/submissionsSlice';
import { HookForm } from './HookForm';
import { UncontrolledForm } from './UncontrolledForm';

function renderForm(FormComponent: typeof HookForm, onSubmit = vi.fn()) {
  const store = configureStore({ reducer: { submissions: submissionsReducer } });

  render(
    <Provider store={store}>
      <FormComponent onSubmit={onSubmit} />
    </Provider>,
  );

  return onSubmit;
}

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Alice');
  await user.type(screen.getByLabelText('Age'), '30');
  await user.type(screen.getByLabelText('Email'), 'alice@example.com');
  await user.selectOptions(screen.getByLabelText('Gender'), 'female');
  await user.click(screen.getByLabelText('I accept the Terms and Conditions'));
  await user.type(screen.getByLabelText('Password'), 'Password1!');
  await user.type(screen.getByLabelText('Confirm password'), 'Password1!');
  await user.type(screen.getByLabelText('Country'), 'Canada');
  await user.upload(
    screen.getByLabelText('Profile image'),
    new File(['image'], 'avatar.png', { type: 'image/png' }),
  );
}

describe.each([
  ['uncontrolled form', UncontrolledForm],
  ['React Hook Form', HookForm],
] as const)('%s', (_, FormComponent) => {
  it('renders labeled basic fields', () => {
    renderForm(FormComponent);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('I accept the Terms and Conditions')).toBeInTheDocument();
  });

  it('collects the entered values', async () => {
    const user = userEvent.setup();
    const onSubmit = renderForm(FormComponent);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alice',
          age: 30,
          email: 'alice@example.com',
          gender: 'female',
          acceptedTerms: true,
          password: 'Password1!',
          confirmPassword: 'Password1!',
          country: 'Canada',
          image: expect.stringMatching(/^data:image\/png;base64,/),
        }),
      ),
    );
  });

  it('renders advanced fields and countries from Redux', () => {
    renderForm(FormComponent);

    expect(screen.getByLabelText('Profile image')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toHaveAttribute('list');
    expect(document.querySelector('option[value="Canada"]')).toBeInTheDocument();
  });

  it('updates the password strength indicator', async () => {
    const user = userEvent.setup();
    renderForm(FormComponent);

    await user.type(screen.getByLabelText('Password'), 'Password1!');

    expect(screen.getByText('One number')).toHaveClass('password-strength__item--met');
    expect(screen.getByText('One uppercase letter')).toHaveClass(
      'password-strength__item--met',
    );
    expect(screen.getByText('One lowercase letter')).toHaveClass(
      'password-strength__item--met',
    );
    expect(screen.getByText('One special character')).toHaveClass(
      'password-strength__item--met',
    );
  });

  it('rejects an unsupported image type', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onSubmit = renderForm(FormComponent);

    await user.selectOptions(screen.getByLabelText('Gender'), 'female');
    await user.upload(
      screen.getByLabelText('Profile image'),
      new File(['file'], 'avatar.gif', { type: 'image/gif' }),
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Choose a PNG or JPEG image.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('form validation timing', () => {
  it('validates the uncontrolled form only after submission', async () => {
    const user = userEvent.setup();
    renderForm(UncontrolledForm);

    await user.type(screen.getByLabelText('Name'), 'alice');

    expect(screen.queryByText('Name must start with an uppercase letter.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Name must start with an uppercase letter.')).toBeInTheDocument();
  });

  it('validates the React Hook Form while the user types', async () => {
    const user = userEvent.setup();
    renderForm(HookForm);
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText('Name'), 'alice');

    expect(await screen.findByText('Name must start with an uppercase letter.')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('enables the React Hook Form submit button when every field is valid', async () => {
    const user = userEvent.setup();
    renderForm(HookForm);

    await fillForm(user);

    await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled());
  });
});

describe.each([
  ['uncontrolled form', UncontrolledForm],
  ['React Hook Form', HookForm],
] as const)('%s shared validation rules', (_, FormComponent) => {
  it('shows errors for invalid age, email, and country', async () => {
    const user = userEvent.setup();
    renderForm(FormComponent);

    await user.type(screen.getByLabelText('Name'), 'Alice');
    await user.type(screen.getByLabelText('Age'), '-1');
    await user.type(screen.getByLabelText('Email'), 'alice@@example.com');
    await user.selectOptions(screen.getByLabelText('Gender'), 'female');
    await user.click(screen.getByLabelText('I accept the Terms and Conditions'));
    await user.type(screen.getByLabelText('Password'), 'Password1!');
    await user.type(screen.getByLabelText('Confirm password'), 'Different1!');
    await user.type(screen.getByLabelText('Country'), 'Atlantis');
    await user.upload(
      screen.getByLabelText('Profile image'),
      new File(['image'], 'avatar.png', { type: 'image/png' }),
    );

    if (FormComponent === UncontrolledForm) {
      await user.click(screen.getByRole('button', { name: 'Submit' }));
    }

    expect(await screen.findByText('Age cannot be negative.')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Select a listed country.')).toBeInTheDocument();
  });

  it('requires matching passwords', async () => {
    const user = userEvent.setup();
    renderForm(FormComponent);

    await fillForm(user);
    const confirmPassword = screen.getByLabelText('Confirm password');
    await user.clear(confirmPassword);
    await user.type(confirmPassword, 'Different1!');

    if (FormComponent === UncontrolledForm) {
      await user.click(screen.getByRole('button', { name: 'Submit' }));
    }

    expect(await screen.findByText('Passwords must match.')).toBeInTheDocument();
  });
});
