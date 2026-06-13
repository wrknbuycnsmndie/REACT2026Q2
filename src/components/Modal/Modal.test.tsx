import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Modal } from './Modal';

function ModalHarness() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type='button' onClick={() => setIsOpen(true)}>
        Open modal
      </button>
      {isOpen && (
        <Modal title='Test modal' onClose={() => setIsOpen(false)}>
          <button type='button'>First action</button>
          <button type='button'>Last action</button>
        </Modal>
      )}
    </>
  );
}

describe('Modal', () => {
  it('renders in the portal and moves focus into the dialog', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    await user.click(screen.getByRole('button', { name: 'Open modal' }));

    const dialog = screen.getByRole('dialog', { name: 'Test modal' });
    expect(document.getElementById('modal-root')).toContainElement(dialog);
    expect(
      within(dialog).getByRole('button', { name: 'Close modal' }),
    ).toHaveFocus();
  });

  it('traps forward and backward focus inside the dialog', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    await user.click(screen.getByRole('button', { name: 'Open modal' }));
    const closeButton = screen.getByRole('button', { name: 'Close modal' });
    const lastAction = screen.getByRole('button', { name: 'Last action' });

    lastAction.focus();
    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(lastAction).toHaveFocus();
  });

  it('closes with Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);
    const trigger = screen.getByRole('button', { name: 'Open modal' });

    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes from the backdrop but not from clicks inside the dialog', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    await user.click(screen.getByRole('button', { name: 'Open modal' }));
    await user.click(screen.getByRole('heading', { name: 'Test modal' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const backdrop = screen.getByRole('dialog').parentElement;
    expect(backdrop).not.toBeNull();

    if (backdrop) {
      await user.click(backdrop);
    }

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
