"use client"

import { Container } from "@chakra-ui/react"
import Header from "app/web/components/header"
import { HorizontalJobCard } from "app/web/components/jobcards/HorizontalJobCard"
import { JobCardsGrid } from "app/web/components/jobcards/JobCardsGrid"
import SearchBar from "app/web/components/searchbar"

const dummyJobs = [
  {
    id: "1",
    title: "Software Engineer",
    description: "Develop and maintain web applications"
  },
  {
    id: "2",
    title: "Product Manager",
    description: "Lead product strategy and development"
  },
  {
    id: "3",
    title: "UX Designer",
    description: "Create user-centered design solutions"
  },
  {
    id: "4",
    title: "Data Scientist",
    description: "Analyze and interpret complex data sets"
  },
  {
    id: "5",
    title: "DevOps Engineer",
    description: "Manage infrastructure and deployment pipelines"
  },
  {
    id: "6",
    title: "Frontend Developer",
    description: "Build responsive and interactive user interfaces"
  },
  {
    id: "7",
    title: "Backend Developer",
    description: "Design and implement server-side applications"
  },
  {
    id: "8",
    title: "QA Engineer",
    description: "Ensure software quality through testing"
  }
]

export default function Web() {
  return (
    <>
      <Header />
      <SearchBar />

      <div className="flex justify-center w-full">
        <JobCardsGrid jobs={dummyJobs} />
      </div>
      <Container maxW="7xl" py={4}>
        <HorizontalJobCard
          title="Featured Job Position"
          description="This is a featured job position with comprehensive benefits and competitive salary"
          jobId="featured-1"
        />
      </Container>
    </>
  )
}