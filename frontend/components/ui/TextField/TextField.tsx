import React from 'react';
import { IconButton } from '../IconButton/IconButton';
import { Input } from '../Input/Input';

type TextFieldProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
  onClear?: () => void;
  placeholder?: string;
  id?: string;
  className?: string;
};

export function TextField({
  value,
  onChange,
  onEnter,
  onClear,
  placeholder,
  id,
  className,
}: TextFieldProps) {
  const handleEnter = (val: string) => {
    onEnter?.();
  };

  return (
    <Input
      id={id}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onEnter={handleEnter}
      trailing={
        value && value !== '' ? (
          <IconButton
            icon="X"
            onClick={() => {
              onChange({
                target: { value: '' },
              } as unknown as React.ChangeEvent<HTMLInputElement>);
              onClear?.();
            }}
            aria-label="検索条件をクリア"
          />
        ) : (
          <IconButton
            icon="Search"
            onClick={() => onEnter?.()}
            aria-label="検索"
          />
        )
      }
    />
  );
}

export default TextField;
