import React from 'react';
import { Input } from '../Input/Input';

type TextFieldProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
  onClear?: () => void;
  placeholder?: string;
  id?: string;
  className?: string;
  /** カスタムの trailing 要素を指定する（指定がなければ何もレンダリングしない） */
  trailing?: React.ReactNode;
};

export function TextField({
  value,
  onChange,
  onEnter,
  onClear,
  placeholder,
  id,
  className,
  trailing,
}: TextFieldProps) {
  const handleEnter = (val: string) => {
    onEnter?.();
  };

  const renderTrailing = () => {
    if (trailing === undefined) return null;
    return trailing;
  };

  return (
    <Input
      id={id}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onEnter={handleEnter}
      trailing={renderTrailing()}
    />
  );
}

export default TextField;
