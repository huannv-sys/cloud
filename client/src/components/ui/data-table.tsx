import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ReactNode } from "react";

interface Column<T> {
  header: ReactNode;
  accessorKey: keyof T | ((row: T) => ReactNode);
  cell?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  selectedRows?: Set<number>;
  onSelectRow?: (id: number, selected: boolean) => void;
  idField?: keyof T;
}

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  selectedRows,
  onSelectRow,
  idField = 'id' as keyof T
}: DataTableProps<T>) {
  const hasSelectionColumn = !!onSelectRow;
  
  const renderCell = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row);
    }
    
    if (typeof column.accessorKey === 'function') {
      return column.accessorKey(row);
    }
    
    return row[column.accessorKey] as ReactNode;
  };
  
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {hasSelectionColumn && (
              <TableHead className="w-0">
                <Checkbox />
              </TableHead>
            )}
            {columns.map((column, index) => (
              <TableHead key={index} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => {
            const id = row[idField] as unknown as number;
            const isSelected = selectedRows?.has(id);
            
            return (
              <TableRow 
                key={rowIndex}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : "hover:bg-gray-50"}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {hasSelectionColumn && (
                  <TableCell className="px-3 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={isSelected} 
                      onCheckedChange={(checked) => onSelectRow?.(id, !!checked)}
                    />
                  </TableCell>
                )}
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className="px-3 py-3 whitespace-nowrap">
                    {renderCell(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
