import { type ReactNode, useId } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';
import { useModalAccessibility } from './useModalAccessibility';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  title: string;
}

function getModalRoot(): HTMLElement {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    throw new Error('Modal portal root was not found.');
  }

  return modalRoot;
}

export function Modal({ children, onClose, title }: ModalProps) {
  const titleId = useId();
  const { closeButtonRef, dialogRef, handleDialogKeyDown } =
    useModalAccessibility(onClose);

  return createPortal(
    <div
      className='modal-backdrop'
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        aria-labelledby={titleId}
        aria-modal='true'
        className='modal'
        onKeyDown={handleDialogKeyDown}
        ref={dialogRef}
        role='dialog'
      >
        <div className='modal__header'>
          <h2 className='modal__title' id={titleId}>
            {title}
          </h2>
          <button
            aria-label='Close modal'
            className='modal__close'
            onClick={onClose}
            ref={closeButtonRef}
            type='button'
          >
            <span aria-hidden='true'>&times;</span>
          </button>
        </div>
        <div className='modal__content'>{children}</div>
      </div>
    </div>,
    getModalRoot(),
  );
}
