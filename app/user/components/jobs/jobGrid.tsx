"use client";

import { Box, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import JobListingCard from "./jobCard";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  logoUrl: string;
  jobUrl: string;
  description: string;
}

interface JobGridProps {
  itemsPerPage?: number;
}

interface JobsApiResponse {
  jobs: Job[];
  hasMore: boolean;
}

// Mock data function
const getMockJobs = (page: number, limit: number): JobsApiResponse => {
  const dummyJobs: Job[] = Array.from({ length: 50 }, (_, i) => ({
    id: `job-${i + 1}`,
    title: `Software Engineer ${i + 1}`,
    company: `Tech Company ${i + 1}`,
    location: `City ${i + 1}`,
    logoUrl: `https://via.placeholder.com/50?text=${i + 1}`,
    jobUrl: `https://example.com/job/${i + 1}`,
    description: `This is a job description for position ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
  }));

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedJobs = dummyJobs.slice(startIndex, endIndex);
  
  return {
    jobs: paginatedJobs,
    hasMore: endIndex < dummyJobs.length
  };
};

export const JobGrid = ({ itemsPerPage = 10 }: JobGridProps) => {
  const { ref, inView } = useInView();

  const fetchJobs = async ({ pageParam = 1 }): Promise<JobsApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    return getMockJobs(pageParam, itemsPerPage);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error
  } = useInfiniteQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "pending") return (
    <HStack gap="5">
      <SkeletonCircle size="12" />
      <Stack flex="1">
        <Skeleton height="5" />
        <Skeleton height="5" width="80%" />
      </Stack>
    </HStack>
  );
  if (status === "error") return <Text color="red.500">Error: {(error as Error).message}</Text>;
  if (!data?.pages[0]?.jobs?.length) return <Text>No jobs found</Text>;
  
  return (
    <Box p={4}>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        gap={{ base: 4, sm: 5, md: 6 }}
        w="full"
        mx="auto"
        px={{ base: 2, sm: 4 }}
      >
        {data.pages.map((page, pageIndex) =>
          page.jobs.map((job: Job) => (
            <JobListingCard
              key={`${job.id}-${pageIndex}`}
              {...job}
            />
          ))
        )}
      </SimpleGrid>
      {isFetchingNextPage && (
        <Box display="flex" justifyContent="center" mt={4}>
          <HStack gap="5">
            <SkeletonCircle size="12" />
            <Stack flex="1">
              <Skeleton height="5" />
              <Skeleton height="5" width="80%" />
            </Stack>
          </HStack>
        </Box>
      )}
      <Box ref={ref} h="20px" />
    </Box>
  );
};
