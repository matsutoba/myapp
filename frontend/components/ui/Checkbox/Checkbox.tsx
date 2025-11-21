import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const checkboxId =
      props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`w-4 h-4 accent-primary bg-card border-surface rounded focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              error ? 'border-danger' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label
              htmlFor={checkboxId}
              className={`font-medium ${
                props.disabled ? 'text-muted' : 'text-foreground'
              } ${error ? 'text-danger' : ''}`}
            >
              {label}
            </label>
            {helperText && !error && <p className="text-muted">{helperText}</p>}
            {error && <p className="text-danger text-xs mt-1">{error}</p>}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
