import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HookForm } from './HookForm';
import { UncontrolledForm } from './UncontrolledForm';

describe.each([
  ['uncontrolled form', UncontrolledForm],
  ['React Hook Form', HookForm],
] as const)('%s', (_, FormComponent) => {
  it('renders labeled basic fields', () => {
    render(<FormComponent onSubmit={vi.fn()} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('I accept the Terms and Conditions')).toBeInTheDocument();
  });

  it('collects the entered values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<FormComponent onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Name'), 'Alice');
    await user.type(screen.getByLabelText('Age'), '30');
    await user.type(screen.getByLabelText('Email'), 'alice@example.com');
    await user.selectOptions(screen.getByLabelText('Gender'), 'female');
    await user.click(screen.getByLabelText('I accept the Terms and Conditions'));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Alice',
      age: 30,
      email: 'alice@example.com',
      gender: 'female',
      acceptedTerms: true,
    });
  });
});
