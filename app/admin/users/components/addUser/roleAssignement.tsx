import { Box, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { Checkbox } from "@/components/ui/checkbox";
import ExpandableTable from "@/components/ui/expandableTables";
import { rightsData } from "./mockData";

export const RoleAssignment = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRights, setSelectedRights] = useState<Set<string>>(new Set());

  const columnHelper = createColumnHelper<any>();
  
  const columns = [
    columnHelper.display({
      id: 'expander',
      cell: ({ row }) => {
        return row.getCanExpand() ? (
          <button
            onClick={row.getToggleExpandedHandler()}
            className="px-2"
          >
            {row.getIsExpanded() ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
          </button>
        ) : null;
      },
      size: 40,
    }),
    columnHelper.accessor('name', {
      header: 'Permission Group',
      cell: info => <Text fontWeight="medium">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: info => <Text color="gray.600" fontSize="sm">{info.getValue()}</Text>,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Access',
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.subrights?.every((right: any) => selectedRights.has(right.id))}
          indeterminate={
            row.original.subrights?.some((right: any) => selectedRights.has(right.id)) &&
            !row.original.subrights?.every((right: any) => selectedRights.has(right.id))
          }
          onChange={(e: { target: { checked: any; }; }) => {
            const newSelectedRights = new Set(selectedRights);
            row.original.subrights?.forEach((right: any) => {
              if (e.target.checked) {
                newSelectedRights.add(right.id);
              } else {
                newSelectedRights.delete(right.id);
              }
            });
            setSelectedRights(newSelectedRights);
          }}
          sx={{ '[data-part="control"]': { borderColor: 'gray.600' } }}
        />      ),
    }),
  ];

  return (
    <Stack gap={6} width="full">
      <Stack gap={4}>
        <Heading size="md">Role Permissions</Heading>
        <Input
          placeholder="Search permissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          maxWidth="400px"
        />
      </Stack>

      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <ExpandableTable
          data={Object.values(rightsData)}
          columns={columns}
          getSubRows={(row: any) => row.subrights}
          renderExpandedContent={(row) => (
            <Stack gap={2} pl={16} pr={6} py={3} bg="gray.50">
              {row.subrights?.map((right: any) => (
                <Flex key={right.id} justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="medium">{right.name}</Text>
                    <Text fontSize="sm" color="gray.600">{right.description}</Text>
                  </Box>
                  <Checkbox
                    isChecked={selectedRights.has(right.id)}
                    onChange={() => {
                      const newSelectedRights = new Set(selectedRights);
                      if (selectedRights.has(right.id)) {
                        newSelectedRights.delete(right.id);
                      } else {
                        newSelectedRights.add(right.id);
                      }
                      setSelectedRights(newSelectedRights);
                    }}
                  />
                </Flex>
              ))}
            </Stack>
          )}
          pageSize={10}
        />
      </Box>
    </Stack>
  );
};

export default RoleAssignment;
