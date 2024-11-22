"use client"
import {
  Box,
  Button,
  createListCollection,
  Flex,
  Input,
  Spinner,
  Table,
  Text,
} from "@chakra-ui/react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table"
import { useDebounce } from "@uidotdev/usehooks"
import { Key, useEffect, useState } from "react"
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select"

interface DataTableProps<T extends object> {
  columns: ColumnDef<T>[]
  fetchData: (options: {
    pageIndex: number
    pageSize: number
    search: string
  }) => Promise<{
    data: T[]
    totalPages: number
    totalRows: number
  }>
  initialPageSize?: number
}

export function DataTable<T extends object>({
  columns,
  fetchData,
  initialPageSize = 10
}: DataTableProps<T>) {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch] = useDebounce(searchTerm, 500)
  const [data, setData] = useState<T[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const pageSizeCollection = createListCollection({
    items: [
      { label: "Show 5", value: "5" },
      { label: "Show 10", value: "10" },
      { label: "Show 20", value: "20" },
      { label: "Show 50", value: "50" },
    ],
  })

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const response = await fetchData({
          pageIndex,
          pageSize,
          search: debouncedSearch || '',
        })
        setData(response.data)
        setTotalPages(response.totalPages)
        setTotalRows(response.totalRows)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [fetchData, pageIndex, pageSize, debouncedSearch])

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  return (
    <Box>
      <Flex mb={4} gap={4}>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="300px"
        />
        <SelectRoot
          value={pageSize.toString()}
          collection={pageSizeCollection}
          onChange={(value: any) => setPagination(prev => ({ ...prev, pageSize: Number(value), pageIndex: 0 }))}
          maxW="100px"
        >
          <SelectTrigger>
            <SelectValueText />
          </SelectTrigger>
          <SelectContent>
            {pageSizeCollection.items.map((item: { value: Key | null | undefined; label: any }) => (
              <SelectItem key={item.value} item={item}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </Flex>

      <Table.Root  bg="white" rounded="md" shadow="sm">
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
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length} textAlign="center" py={8}>
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

      <Flex justify="space-between" align="center" mt={4}>
        <Text>
          Showing {pageSize * pageIndex + 1} to{" "}
          {Math.min(pageSize * (pageIndex + 1), totalRows)} of {totalRows} results
        </Text>
        <Flex gap={2}>
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}