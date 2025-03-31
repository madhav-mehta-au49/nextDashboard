'use client';

import React from 'react';
import { Box, Container, Heading, Text, SimpleGrid, Flex, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { CompanyFilters } from './components/directory/CompanyFilters';
import { CompanyCard } from './components/directory/CompanyCard';
import { useCompanies } from './hooks/useCompanies';

export default function CompaniesDirectory() {
  const { companies, isLoading, error, filters, updateFilters } = useCompanies();

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>Company Directory</Heading>
        <Text color="gray.600">
          Discover and connect with companies from around the world
        </Text>
      </Box>

      <CompanyFilters 
        filters={filters} 
        onFilterChange={updateFilters} 
      />

      {isLoading ? (
        <Flex justify="center" align="center" minH="300px">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Flex>
      ) : error ? (
        <Alert status="error" borderRadius="md" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      ) : companies.length === 0 ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          No companies found matching your criteria. Try adjusting your filters.
        </Alert>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {companies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
