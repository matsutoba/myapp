import React from 'react';
import { Input } from '../Input/Input';

type TextFieldProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
  onClear?: () => void;
  placeholder?: string;
  id?: string;
  className?: string;
  /** カスタムの trailing 要素を指定する（指定がなければ何もレンダリングしない） */
  trailing?: React.ReactNode;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      value,
      onChange,
      onEnter,
      onClear,
      placeholder,
      id,
      className,
      trailing,
      label,
      error,
      helperText,
      required,
      ...rest
    },
    ref,
  ) => {
    const handleEnter = (val: string) => {
      onEnter?.();
    };

    const renderTrailing = () => {
      if (trailing === undefined) return null;
      return trailing;
    };

    return (
      <Input
        ref={ref}
        id={id}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onEnter={handleEnter}
        trailing={renderTrailing()}
        label={label}
        error={error}
        helperText={helperText}
        required={required}
        {...rest}
      />
    );
  },
);

TextField.displayName = 'TextField';

export default TextField;
