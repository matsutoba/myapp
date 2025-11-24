import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  /** 右端に表示する要素（例：検索ボタン） */
  trailing?: React.ReactNode;
  /** Enter キーで値を渡すハンドラ */
  onEnter?: (value: string) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      className = '',
      id,
      trailing,
      onEnter,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
      if (e.key === 'Enter') {
        onEnter?.((e.target as HTMLInputElement).value);
      }
      if (props.onKeyDown) props.onKeyDown(e);
    };

    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
            {required && <span className="text-on-danger ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`w-full pr-10 px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus-ring-primary disabled:bg-card disabled:cursor-not-allowed ${
              error ? 'border-danger' : 'border-surface'
            }`}
            {...props}
            onKeyDown={handleKeyDown}
          />

          {trailing && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              {trailing}
            </div>
          )}
        </div>

        {helperText && !error && (
          <p className="mt-1 text-sm text-muted">{helperText}</p>
        )}
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
