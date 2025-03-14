
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortDirection = 'asc' | 'desc' | null;
type SortConfig<T> = {
  key: keyof T | null;
  direction: SortDirection;
};

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchField?: keyof T;
  pageSize?: number;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchField,
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: null,
    direction: null,
  });

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter data based on search query
  const filteredData = searchField && searchQuery
    ? data.filter((item) => {
        const value = item[searchField];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (typeof value === 'number') {
          return value.toString().includes(searchQuery);
        }
        return false;
      })
    : data;

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortConfig.direction === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    
    let direction: SortDirection = 'asc';
    
    if (sortConfig.key === column.accessorKey) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({
      key: direction ? column.accessorKey : null,
      direction,
    });
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    
    if (sortConfig.key === column.accessorKey) {
      if (sortConfig.direction === 'asc') {
        return <ArrowUpDown className="ml-1 h-4 w-4 text-primary" />;
      } else if (sortConfig.direction === 'desc') {
        return <ArrowUpDown className="ml-1 h-4 w-4 text-primary rotate-180" />;
      }
    }
    
    return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground opacity-50" />;
  };

  return (
    <div className={cn("space-y-4 animate-fade-in ", className)}>
      {searchField && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full md:w-72"
          />
        </div>
      )}
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/500 ">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead 
                  key={index}
                  className={cn(
                    column.sortable && "cursor-pointer select-none text-pink-600"
                  )}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center bg ">
                    {column.header}
                    {getSortIcon(column)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-white"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-secondary/5 transition-colors ">
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.cell ? column.cell(row) : String(row[column.accessorKey] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-wnite">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
