import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react';
import { useEffect, type ReactNode, useCallback } from 'react';
import styles from './popover.module.css';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  anchor: HTMLElement | null;
}

export const Popover = ({
  isOpen,
  onClose,
  children,
  anchor,
}: PopoverProps): React.ReactElement | null => {
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (anchor && isOpen) {
      refs.setReference(anchor);
    }
  }, [anchor, isOpen, refs]);

  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        ref={setFloatingRef}
        style={floatingStyles}
        className={styles.popover}
      >
        {children}
      </div>
    </>
  );
};
