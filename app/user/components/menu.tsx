import { 
    Box, 
    Button, 
    HStack,
    Text,
    VStack
  } from "@chakra-ui/react";
  import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "@/components/ui/accordion";
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
      <AccordionItem key={section.title}>
        <AccordionItemTrigger>
          <Text fontWeight="medium">{section.title}</Text>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <VStack align="stretch" gap={2}>
            {section.options.map((option, index) => (
              <HStack key={`${section.title}-${index}`} justify="space-between">
                <Checkbox>
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
              <Button variant="ghost" size="sm" colorScheme="blue">
                View More
              </Button>
            )}
          </VStack>
        </AccordionItemContent>
      </AccordionItem>
    );
  
    return (
      <Box w="full" maxW="sm" p={4} bg="gray.50" borderRight="1px solid" borderColor="gray.200">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          {title}
        </Text>
        <AccordionRoot allowMultiple>
          {sections.map(renderFilterSection)}
        </AccordionRoot>
      </Box>
    );
  };
  
  export default FiltersSidebar;
  