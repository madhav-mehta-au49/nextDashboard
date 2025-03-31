import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Input, 
  Text,
} from '@chakra-ui/react';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import {
  MenuCheckboxItem,
  MenuContent,
  MenuItemGroup,
  MenuRoot,
  MenuSeparator,
  MenuTrigger
} from "@/components/ui/menu";
import { CompanyFilter } from '../../types';
import { useColorModeValue } from '@/components/ui/color-mode';

interface CompanyFiltersProps {
  filters: CompanyFilter;
  onFilterChange: (filters: Partial<CompanyFilter>) => void;
}

export const CompanyFilters: React.FC<CompanyFiltersProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  const [localFilters, setLocalFilters] = useState<CompanyFilter>(filters);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
    onFilterChange({ [name]: value });
  };

  const handleIndustryChange = (industry: string) => {
    setLocalFilters(prev => ({ ...prev, industry }));
    onFilterChange({ industry });
  };

  const handleSizeChange = (size: string) => {
    setLocalFilters(prev => ({ ...prev, size }));
    onFilterChange({ size });
  };

  const handleLocationChange = (location: string) => {
    setLocalFilters(prev => ({ ...prev, location }));
    onFilterChange({ location });
  };

  const handleClear = () => {
    const emptyFilters = {
      industry: '',
      size: '',
      location: '',
      searchTerm: ''
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <Box 
      as="section" 
      bg={bgColor} 
      borderWidth="1px" 
      borderColor={borderColor} 
      borderRadius="lg" 
      p={4} 
      mb={6}
      shadow="sm"
    >
      <Flex direction="column" gap={4}>
        <Flex gap={2} align="center">
          <Box position="relative" flex={1}>
            <Input
              name="searchTerm"
              placeholder="Search companies..."
              value={localFilters.searchTerm || ''}
              onChange={handleInputChange}
              pl={10}
              borderRadius="md"
              _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
            />
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
              <FiSearch color="gray.400" />
            </Box>
          </Box>
          
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="outline">
                <FiFilter className="mr-2 size-4" />
                Filters
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItemGroup title="Industry">
                <MenuCheckboxItem 
                  value="Technology"
                  checked={localFilters.industry === "Technology"}
                  onCheckedChange={() => handleIndustryChange("Technology")}
                >
                  Technology
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="Healthcare"
                  checked={localFilters.industry === "Healthcare"}
                  onCheckedChange={() => handleIndustryChange("Healthcare")}
                >
                  Healthcare
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="Finance"
                  checked={localFilters.industry === "Finance"}
                  onCheckedChange={() => handleIndustryChange("Finance")}
                >
                  Finance
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="Education"
                  checked={localFilters.industry === "Education"}
                  onCheckedChange={() => handleIndustryChange("Education")}
                >
                  Education
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="Retail"
                  checked={localFilters.industry === "Retail"}
                  onCheckedChange={() => handleIndustryChange("Retail")}
                >
                  Retail
                </MenuCheckboxItem>
              </MenuItemGroup>
              
              <MenuSeparator />
              
              <MenuItemGroup title="Company Size">
                <MenuCheckboxItem 
                  value="1-10"
                  checked={localFilters.size === "1-10"}
                  onCheckedChange={() => handleSizeChange("1-10")}
                >
                  1-10 employees
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="11-50"
                  checked={localFilters.size === "11-50"}
                  onCheckedChange={() => handleSizeChange("11-50")}
                >
                  11-50 employees
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="51-200"
                  checked={localFilters.size === "51-200"}
                  onCheckedChange={() => handleSizeChange("51-200")}
                >
                  51-200 employees
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="201-500"
                  checked={localFilters.size === "201-500"}
                  onCheckedChange={() => handleSizeChange("201-500")}
                >
                  201-500 employees
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="501-1000"
                  checked={localFilters.size === "501-1000"}
                  onCheckedChange={() => handleSizeChange("501-1000")}
                >
                  501-1000 employees
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="1001+"
                  checked={localFilters.size === "1001+"}
                  onCheckedChange={() => handleSizeChange("1001+")}
                >
                  1001+ employees
                </MenuCheckboxItem>
              </MenuItemGroup>
              
              <MenuSeparator />
              
              <MenuItemGroup title="Location">
                <MenuCheckboxItem 
                  value="Remote"
                  checked={localFilters.location === "Remote"}
                  onCheckedChange={() => handleLocationChange("Remote")}
                >
                  Remote
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="United States"
                  checked={localFilters.location === "United States"}
                  onCheckedChange={() => handleLocationChange("United States")}
                >
                  United States
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="Europe"
                  checked={localFilters.location === "Europe"}
                  onCheckedChange={() => handleLocationChange("Europe")}
                >
                  Europe
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="Asia"
                  checked={localFilters.location === "Asia"}
                  onCheckedChange={() => handleLocationChange("Asia")}
                >
                  Asia
                </MenuCheckboxItem>
                <MenuCheckboxItem 
                  value="Australia"
                  checked={localFilters.location === "Australia"}
                  onCheckedChange={() => handleLocationChange("Australia")}
                >
                  Australia
                </MenuCheckboxItem>
              </MenuItemGroup>
            </MenuContent>
          </MenuRoot>
          
          <Button 
            variant="default"
            onClick={handleClear}
          >
            Clear
          </Button>
        </Flex>
        
        {(filters.industry || filters.size || filters.location || filters.searchTerm) && (
          <Flex gap={2} mt={2} flexWrap="wrap" align="center">
            <Text fontSize="sm" fontWeight="medium">Active filters:</Text>
            
            {filters.industry && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onFilterChange({ industry: '' })}
              >
                Industry: {filters.industry}
                <FiX className="ml-2 size-3" />
              </Button>
            )}
            
            {filters.size && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onFilterChange({ size: '' })}
              >
                Size: {filters.size}
                <FiX className="ml-2 size-3" />
              </Button>
            )}
            
            {filters.location && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onFilterChange({ location: '' })}
              >
                Location: {filters.location}
                <FiX className="ml-2 size-3" />
              </Button>
            )}
            
            {filters.searchTerm && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onFilterChange({ searchTerm: '' })}
              >
                Search: {filters.searchTerm}
                <FiX className="ml-2 size-3" />
              </Button>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
