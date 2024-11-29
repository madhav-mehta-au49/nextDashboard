import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable
} from '@tanstack/react-table'
import { Fragment, useState } from 'react'

interface ExpandableTableProps<T> {
    data: T[]
    columns: any[]
    getSubRows?: (row: T) => T[]
    renderExpandedContent?: (row: T) => React.ReactNode
    pageSize?: number
}

const ExpandableTable = <T extends object>({
    data,
    columns,
    getSubRows,
    renderExpandedContent,
    pageSize = 10
}: ExpandableTableProps<T>) => {
    const [expanded, setExpanded] = useState({})
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize,
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            expanded,
            sorting,
            pagination,
            columnFilters,
        },
        onExpandedChange: setExpanded,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        getSubRows,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
                {table.getAllColumns()
                    .filter(column => column.getCanFilter())
                    .map(column => (
                        <div key={column.id} className="flex items-center gap-2">
                            <label>{column.columnDef.header as string}:</label>
                            <input
                                type="text"
                                className="border rounded px-2 py-1"
                                value={column.getFilterValue() as string ?? ''}
                                onChange={e => column.setFilterValue(e.target.value)}
                            />
                        </div>
                    ))}
            </div>

            {/* Table */}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {header.column.getIsSorted() && (
                                        <span className="ml-2">
                                            {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map(row => (
                        <Fragment key={row.id}>
                        <tr>
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                        {row.getIsExpanded() && renderExpandedContent && (
                          <tr key={`${row.id}-expanded`}>
                            <td colSpan={columns.length} className="px-6 py-4">
                              {renderExpandedContent(row.original)}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </span>
                </div>
                <select
                    className="border rounded px-2 py-1"
                    value={table.getState().pagination.pageSize}
                    onChange={e => table.setPageSize(Number(e.target.value))}
                >
                    {[10, 20, 30, 40, 50].map(size => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default ExpandableTable
