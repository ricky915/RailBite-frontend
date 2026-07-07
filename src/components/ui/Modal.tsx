import {
  useEffect,
  useRef,
  type FC,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog using `aria-modal`; traps focus and returns focus to the
 * triggering element on close (Section 6.5 `<Modal />` / Section 8.10 a11y).
 * Supports the Compound Component pattern via `Modal.Header/Body/Footer`
 * (Section 6.4).
 */
function ModalImpl({ isOpen, onClose, title, children, className }: ModalProps): JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
    const dialogNode = dialogRef.current;
    const focusableElements = dialogNode?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    (focusableElements?.[0] ?? dialogNode)?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogNode) return;

      const focusable = Array.from(
        dialogNode.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl focus:outline-none',
          className,
        )}
      >
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">{title}</h2>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}

const ModalHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cn('mb-4', className)} {...rest} />
);

const ModalBody: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cn('text-sm text-neutral-700', className)} {...rest} />
);

const ModalFooter: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cn('mt-6 flex justify-end gap-3', className)} {...rest} />
);

export const Modal = Object.assign(ModalImpl, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
