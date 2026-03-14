import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ReactElement,
} from 'react';
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
  renderOption: (option: T, active?: boolean) => ReactElement;
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
}: ComboboxProps<T>): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      setAnchorEl(inputRef.current);
    }
  }, []);

  useEffect(() => {
    if (isOpen && activeIndex !== -1 && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, isOpen]);

  const openListAndSetFirst = (): void => {
    setIsOpen(true);
    setActiveIndex(options.length ? 0 : -1);
  };

  const handleInputClick = (): void => openListAndSetFirst();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onInputChange(e.target.value);
    setIsOpen(true);
    setActiveIndex(0);
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
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (!isOpen && e.key === 'Enter' && value) {
      return;
    }

    if (
      !isOpen &&
      (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')
    ) {
      openListAndSetFirst();
      return;
    }

    if (!isOpen) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) =>
        !options.length ? -1 : prev < options.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        !options.length ? -1 : prev > 0 ? prev - 1 : options.length - 1
      );
    } else if (e.key === 'Enter') {
      if (activeIndex !== -1 && options[activeIndex]) {
        e.preventDefault();
        handleOptionClick(options[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
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
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      />
      <Popover
        isOpen={isOpen && anchorEl !== null}
        onClose={() => setIsOpen(false)}
        anchor={anchorEl}
      >
        <ul className={styles.list} role="listbox">
          {!options.length ? (
            <li className={styles.empty}>Немає результатів</li>
          ) : (
            options.map((option, index) => (
              <li
                key={getOptionKey(option)}
                className={`${styles.option} ${index === activeIndex ? styles.active : ''}`}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                onClick={() => handleOptionClick(option)}
                role="option"
                aria-selected={
                  value ? getOptionKey(option) === getOptionKey(value) : false
                }
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {renderOption(option, index === activeIndex)}
              </li>
            ))
          )}
        </ul>
      </Popover>
    </div>
  );
};
