'use client';

import { Card, Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import {
  flexRender,
  type ColumnDef,
  type Table as TanTable,
} from '@tanstack/react-table';

type ColumnWithMeta = ColumnDef<any, any> & {
  meta?: { thClass?: string; tdClass?: string } | undefined;
};

type Props = {
  table: TanTable<any>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function OrderListTable({ table }: Props) {
  return (
    <>
      <Card padding="none" className="overflow-hidden">
        <Table className="w-full table-fixed">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    className={
                      (header.column.columnDef as ColumnWithMeta).meta
                        ?.thClass ?? ''
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    className={
                      (cell.column.columnDef as ColumnWithMeta).meta?.tdClass ??
                      ''
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </>
  );
}
