import React, { useState, useRef, type KeyboardEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Popover } from '@/components/ui/popover';
import styles from './combobox.module.css';

interface ComboboxProps<T> {
  value: T | null;
  inputValue: string;
  onInputChange: (value: string) => void;
  onValueChange: (value: T | null) => void;
  options: T[];
  getOptionLabel: (option: T) => string;
  getOptionKey: (option: T) => string | number;
  renderOption: (option: T) => React.ReactElement;
  placeholder?: string;
}

export const Combobox = <T,>({
  value,
  inputValue,
  onInputChange,
  onValueChange,
  options,
  getOptionLabel,
  getOptionKey,
  renderOption,
  placeholder,
}: ComboboxProps<T>): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      setAnchorElement(inputRef.current);
    }
  }, []);

  const handleInputClick = (): void => {
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onInputChange(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (option: T): void => {
    onValueChange(option);
    onInputChange(getOptionLabel(option));
    setIsOpen(false);
  };

  const handleClear = (): void => {
    onValueChange(null);
    onInputChange('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onClick={handleInputClick}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        showClearButton={!!value}
        onClear={handleClear}
      />
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchor={anchorElement}
      >
        <ul className={styles.list}>
          {!options.length ? (
            <li className={styles.empty}>Немає результатів</li>
          ) : (
            options.map((option) => (
              <li
                key={getOptionKey(option)}
                className={styles.option}
                onClick={() => handleOptionClick(option)}
              >
                {renderOption(option)}
              </li>
            ))
          )}
        </ul>
      </Popover>
    </div>
  );
};
