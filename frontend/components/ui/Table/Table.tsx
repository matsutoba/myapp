'use client';

import React from 'react';

type TableProps = React.TableHTMLAttributes<HTMLTableElement> & {
  children: React.ReactNode;
};
type SectionProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  children?: React.ReactNode;
};
type RowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  children?: React.ReactNode;
};
type CellProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  children?: React.ReactNode;
};

export function Table({ children, className = '', ...rest }: TableProps) {
  return (
    <table
      className={`${className} min-w-full divide-y divide-gray-200`}
      {...rest}
    >
      {children}
    </table>
  );
}

export function Thead({ children, className = '', ...rest }: SectionProps) {
  return (
    <thead className={`${className} bg-gray-50`} {...rest}>
      {children}
    </thead>
  );
}

export function Tbody({ children, className = '', ...rest }: SectionProps) {
  return (
    <tbody
      className={`${className} bg-white divide-y divide-gray-200`}
      {...rest}
    >
      {children}
    </tbody>
  );
}

export function Tr({ children, className = '', ...rest }: RowProps) {
  return (
    <tr className={className} {...rest}>
      {children}
    </tr>
  );
}

export function Th({ children, className = '', ...rest }: CellProps) {
  const base =
    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase';
  return (
    <th className={`${base} ${className}`} {...rest}>
      {children}
    </th>
  );
}

export function Td({
  children,
  className = '',
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  const base = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
  return (
    <td className={`${base} ${className}`} {...rest}>
      {children}
    </td>
  );
}
