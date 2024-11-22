"use client"
import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Table,
} from "@chakra-ui/react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {  useDebounce } from "@uidotdev/usehooks"
import { useEffect, useState } from "react"
import { Form as RadixForm } from "@radix-ui/react-form"
import { SelectItem, SelectRoot } from "@/components/ui/select"
import { toaster } from "@/components/ui/toaster"

interface EditableCellProps {
  value: any
  row: any
  column: any
  onSave: (value: any) => void
  type: 'text' | 'select' | 'number' | 'date'
  options?: { label: string; value: any }[]
}

const EditableCell = ({ value, type, options, onSave }: EditableCellProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const debouncedSave = useDebounce(onSave, 500)

  if (!isEditing) {
    return (
      <Box onClick={() => setIsEditing(true)} cursor="pointer">
        {value}
      </Box>
    )
  }

  switch (type) {
    case 'select':
      return (
        <SelectRoot 
          value={value} 
          onValueChange={(newValue: any) => {
            debouncedSave(newValue)
            setIsEditing(false)
          }}
        >
          {options?.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectRoot>
      )
    default:
      return (
        <Input
          autoFocus
          defaultValue={value}
          onBlur={(e) => {
            debouncedSave(e.target.value)
            setIsEditing(false)
          }}
        />
      )
  }
}

interface EditableDataTableProps<T extends object> {
  columns: ColumnDef<T>[]
  apiEndpoint: string
  initialPageSize?: number
}

export function EditableDataTable<T extends object>({
  columns,
  apiEndpoint,
  initialPageSize = 10
}: EditableDataTableProps<T>) {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 500)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `${apiEndpoint}?page=${pageIndex}&limit=${pageSize}&search=${debouncedSearch}`
        )
        if (!response.ok) throw new Error('Failed to fetch data')
        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [pageIndex, pageSize, debouncedSearch, apiEndpoint])

  const handleCellSave = async (rowId: string, columnId: string, value: any) => {
    try {
      const response = await fetch(`${apiEndpoint}/${rowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [columnId]: value })
      })
      
      if (!response.ok) throw new Error('Failed to update')
      
      toaster.toast({
        title: "Updated successfully",
        type: "success",
        duration: 3000
      })
    } catch (error) {
      toaster.toast({
        title: "Update failed",
        type: "error",
        duration: 3000
      })
    }
  }

  const enhancedColumns = columns.map(col => ({
    ...col,
    cell: ({ getValue, row, column }: any) => (
      <EditableCell
        value={getValue()}
        row={row}
        column={column}
        onSave={(value) => handleCellSave(row.id, column.id, value)}
        type={col.type || 'text'}
        options={col.options}
      />
    )
  }))

  const table = useReactTable({
    data: data?.items || [],
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: data?.totalPages || 0,
    manualPagination: true,
  })

  return (
    <Box>
      <RadixForm>
        <Flex mb={4}>
          <RadixForm.Field name="search">
            <RadixForm.Control asChild>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                maxW="300px"
              />
            </RadixForm.Control>
          </RadixForm.Field>
        </Flex>

        <Table.Root bg="white" rounded="md" shadow="sm">
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.ColumnHeader key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell colSpan={columns.length}>
                  <Spinner />
                </Table.Cell>
              </Table.Row>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>

        <Flex justify="flex-end" mt={4} gap={2}>
          <Button
            onClick={() => setPageIndex(p => p - 1)}
            disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPageIndex(p => p + 1)}
            disabled={!data?.hasMore}
          >
            Next
          </Button>
        </Flex>
      </RadixForm>
    </Box>
  )
}