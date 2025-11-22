import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      options,
      className = '',
      id,
      ...props
    },
    ref,
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="mb-6 relative">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
            {required && <span className="text-on-danger ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full appearance-none hover:cursor-pointer px-3 pr-10 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus-ring-primary disabled:bg-card disabled:cursor-not-allowed ${
            error ? 'border-danger' : 'border-surface'
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown icon placed on the right to avoid touching the edge */}
        <div className="pointer-events-none absolute inset-y-12 right-3 flex items-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            className="text-muted"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {helperText && !error && (
          <p className="mt-1 text-sm text-muted">{helperText}</p>
        )}
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
