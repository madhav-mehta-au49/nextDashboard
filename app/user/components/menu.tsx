import { 
  Box, 
  Button, 
  HStack,
  Text,
  VStack
} from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterOption {
  label: string;
  count?: number;
}

interface FilterSection {
  title: string;
  options: FilterOption[];
  showViewMore?: boolean;
}

interface FiltersSidebarProps {
  sections: FilterSection[];
  title?: string;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ 
  sections,
  title = "All Filters" 
}) => {
  const renderFilterSection = (section: FilterSection) => (
    <Box key={section.title}>
      <Text fontWeight="medium" color="teal.500" mb={2}>{section.title}</Text>
      <VStack align="stretch" gap={2}>
        {section.options.map((option, index) => (
          <HStack key={`${section.title}-${index}`} justify="space-between">
            <Checkbox 
              variant="subtle"
              colorScheme="teal"
              colorPalette="teal"
              borderColor="teal.500"
              size="md"
            >
              <Text fontSize="sm">{option.label}</Text>
            </Checkbox>
            {option.count && (
              <Text fontSize="xs" color="gray.500">
                ({option.count})
              </Text>
            )}
          </HStack>
        ))}
        {section.showViewMore && (
          <Button variant="ghost" size="sm" colorScheme="teal">
            View More
          </Button>
        )}
      </VStack>
    </Box>
  );

  return (
    <Box w="280px" maxW="sm" p={4} bg="white" borderRight="1px solid" borderColor="teal.200">
      <Text fontSize="xl" fontWeight="bold" mb={4} color="teal.500">
        {title}
      </Text>
      <VStack align="stretch" spacing={4}>
        {sections.map(renderFilterSection)}
      </VStack>
    </Box>
  );
};

export default FiltersSidebar;

// Usage example:
/*
const sections: FilterSection[] = [
  {
    title: "Categories",
    options: [
      { label: "Technology", count: 150 },
      { label: "Design", count: 85 },
      { label: "Marketing", count: 64 }
    ],
    showViewMore: true
  },
  {
    title: "Experience Level",
    options: [
      { label: "Entry Level", count: 300 },
      { label: "Mid Level", count: 200 },
      { label: "Senior", count: 100 }
    ]
  }
];

<FiltersSidebar sections={sections} />
*/