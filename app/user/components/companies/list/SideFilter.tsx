import { 
    Box, 
    Button, 
    HStack,
    Text,
    VStack
  } from "@chakra-ui/react";
  import { Checkbox } from "@/components/ui/checkbox";
  
  interface CompanyFilterOption {
    label: string;
    count?: number;
  }
  
  interface CompanyFilterSection {
    title: string;
    options: CompanyFilterOption[];
    showViewMore?: boolean;
  }
  
  interface CompanySideFilterProps {
    sections: CompanyFilterSection[];
    title?: string;
  }
  
  const CompanySideFilter: React.FC<CompanySideFilterProps> = ({ 
    sections,
    title = "Company Filters" 
  }) => {
    const renderFilterSection = (section: CompanyFilterSection) => (
      <Box key={section.title}>
        <Text fontWeight="medium" color="blue.500" mb={2}>{section.title}</Text>
        <VStack align="stretch" gap={2}>
          {section.options.map((option, index) => (
            <HStack key={`${section.title}-${index}`} justify="space-between">
              <Checkbox 
                variant="subtle"
                colorScheme="blue"
                colorPalette="blue"
                borderColor="blue.500"
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
            <Button variant="ghost" size="sm" colorScheme="blue">
              View More
            </Button>
          )}
        </VStack>
      </Box>
    );
  
    return (
      <Box w="280px" maxW="sm" p={4} bg="white" borderRight="1px solid" borderColor="blue.200">
        <Text fontSize="xl" fontWeight="bold" mb={4} color="blue.500">
          {title}
        </Text>
        <VStack align="stretch" gap={4}>
          {sections.map(renderFilterSection)}
        </VStack>
      </Box>
    );
  };
  
  export default CompanySideFilter;
  
  // Usage example:
  /*
  const companySections: CompanyFilterSection[] = [
    {
      title: "Industry",
      options: [
        { label: "Technology", count: 120 },
        { label: "Healthcare", count: 85 },
        { label: "Finance", count: 64 }
      ],
      showViewMore: true
    },
    {
      title: "Company Size",
      options: [
        { label: "1-50", count: 200 },
        { label: "51-200", count: 150 },
        { label: "201-1000", count: 100 },
        { label: "1000+", count: 50 }
      ]
    },
    {
      title: "Location",
      options: [
        { label: "Remote", count: 300 },
        { label: "On-site", count: 200 },
        { label: "Hybrid", count: 150 }
      ]
    }
  ];
  */
  