import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, required, className = '', id, ...props },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
            {required && <span className="text-on-danger ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus-ring-primary disabled:bg-card disabled:cursor-not-allowed ${
            error ? 'border-danger' : 'border-surface'
          } ${className}`}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1 text-sm text-muted">{helperText}</p>
        )}
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
