'use client';

import { Card, Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import { flexRender, type Table as TanTable } from '@tanstack/react-table';

type Props = {
  table: TanTable<any>;
};

export default function CustomerListTable({ table }: Props) {
  return (
    <>
      <Card padding="none" className="overflow-hidden">
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
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
                  <Td key={cell.id}>
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
