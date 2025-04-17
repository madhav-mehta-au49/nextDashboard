"use client";

import { Box, Container, Flex } from "@chakra-ui/react";
import Footer from "../../../components/footer";
import Header from "../../../components/EmployeeHeader";
import { JobGrid } from "../components/jobs/jobGrid";
import FiltersSidebar from "../../../components/menu";
import SubHeader from "../../../components/subheader";

const filterSections = [
  {
    title: "Job Type",
    options: [
      { label: "Full-time", count: 234 },
      { label: "Part-time", count: 156 },
      { label: "Contract", count: 89 },
      { label: "Internship", count: 45 },
    ],
  },
  {
    title: "Experience Level",
    options: [
      { label: "Entry Level", count: 167 },
      { label: "Mid Level", count: 245 },
      { label: "Senior Level", count: 123 },
      { label: "Director", count: 34 },
    ],
  },
  {
    title: "Location",
    options: [
      { label: "Remote", count: 189 },
      { label: "Hybrid", count: 145 },
      { label: "On-site", count: 234 },
    ],
    showViewMore: true,
  },
  {
    title: "Salary Range",
    options: [
      { label: "$0-$50k", count: 123 },
      { label: "$50k-$100k", count: 234 },
      { label: "$100k-$150k", count: 167 },
      { label: "$150k+", count: 89 },
    ],
  },
];

export default function DashboardPage() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <SubHeader />
      <Container maxW="1400px" flex="1" py={6}>
        <Flex gap={6}>
          <FiltersSidebar sections={filterSections} />
          <Box flex="1">
            <JobGrid itemsPerPage={12} />
          </Box>
        </Flex>
      </Container>
      <Footer />
    </Box>
  );
}
