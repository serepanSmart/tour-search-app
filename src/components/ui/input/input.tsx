import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showClearButton?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { onClear, showClearButton = false, className = '', ...props },
    ref
  ): React.ReactElement => (
    <div className={styles.wrapper}>
      <input ref={ref} className={`${styles.input} ${className}`} {...props} />
      {showClearButton && props.value && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClear}
          aria-label="Clear input"
        >
          ×
        </button>
      )}
    </div>
  )
);

Input.displayName = 'Input';
