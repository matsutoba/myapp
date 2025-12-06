'use client';

import React, { useId } from 'react';
import { Icon } from '../Icon/Icon';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  /** readonly: allow focus but prevent changes */
  readOnly?: boolean;
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
    const generated = useId();
    const selectId = id ?? `select-${generated}`;
    const {
      onChange: originalOnChange,
      onKeyDown: originalOnKeyDown,
      readOnly: readOnlyProp,
      disabled: disabledProp,
      ...restProps
    } = props;

    const isDisabled = Boolean(disabledProp);
    const isReadOnly = Boolean(readOnlyProp);

    return (
      <div
        className={`mb-6 relative ${
          isDisabled || isReadOnly ? 'cursor-not-allowed' : ''
        }`}
      >
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
            {required && <span className="text-on-danger ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-readonly={isReadOnly ? 'true' : undefined}
            disabled={isDisabled}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              if (isReadOnly) {
                e.preventDefault();
                return;
              }
              originalOnChange?.(e);
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLSelectElement>) => {
              if (isReadOnly) {
                // allow Tab to move focus, block other keys to avoid selection changes
                if (e.key === 'Tab') return;
                e.preventDefault();
                return;
              }
              originalOnKeyDown?.(e);
            }}
            onMouseDown={(e: React.MouseEvent<HTMLSelectElement>) => {
              if (isReadOnly) {
                // prevent the native dropdown from opening via mouse
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className={`w-full appearance-none px-3 pr-10 py-2 border rounded-md bg-card text-foreground ${
              // If readOnly, keep focusable but suppress focus ring/outline
              isReadOnly
                ? 'focus:outline-none focus:ring-0'
                : 'focus:outline-none focus:ring-2 focus-ring-primary'
            } ${
              isDisabled || isReadOnly ? 'cursor-not-allowed' : ''
            } disabled:cursor-not-allowed ${
              error ? 'border-danger' : 'border-surface'
            } ${
              isDisabled
                ? 'opacity-60 bg-surface/50 text-muted pointer-events-none'
                : isReadOnly
                ? 'opacity-60 bg-surface/50 text-muted'
                : ''
            } ${className}`}
            {...(restProps as Omit<
              SelectProps,
              'onChange' | 'onKeyDown' | 'disabled' | 'readOnly'
            >)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon
              name="ChevronDown"
              className={isDisabled || isReadOnly ? 'opacity-50' : ''}
            />
          </span>
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
