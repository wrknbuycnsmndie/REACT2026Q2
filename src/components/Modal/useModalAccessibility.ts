import { type KeyboardEvent, useEffect, useRef } from 'react';

function canReceiveFocus(element: HTMLElement) {
  return element.tabIndex >= 0 && !element.matches(':disabled, [hidden]');
}

function keepFocusInside(event: KeyboardEvent, dialog: HTMLElement) {
  const focusableElements = Array.from(
    dialog.querySelectorAll<HTMLElement>('*'),
  ).filter(canReceiveFocus);

  const firstElement = focusableElements.at(0);
  const lastElement = focusableElements.at(-1);

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement?.focus();
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement?.focus();
  }
}

export function useModalAccessibility(onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const trigger = document.activeElement;
    closeButtonRef.current?.focus();

    return () => {
      if (trigger instanceof HTMLElement) {
        trigger.focus();
      }
    };
  }, []);

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      onClose();
    }

    if (event.key === 'Tab' && dialogRef.current) {
      keepFocusInside(event, dialogRef.current);
    }
  }

  return { closeButtonRef, dialogRef, handleDialogKeyDown };
}
