"use client"

import { Box, Container, Heading, HStack, Spacer, VStack } from "@chakra-ui/react"
import Footer from '@/app/user/components/footer'
import Header from '@/app/user/components/header'
import SubHeader from '@/app/user/components/subheader'
import { CandidateCard } from "../components/candidates/list/CandidateCard"
import { CandidateActions } from "../components/candidates/list/CandidateActions"
import { CandidateFilterMenu } from "../components/candidates/list/CandidateFilterMenu"
import { CandidateSort } from "../components/candidates/list/CandidateSort"
import { RightSidebarCard } from '../components/candidates/list/SideCards'

export default function CandidatesPage() {
    const candidates = [
        {
            candidateId: "1",
            name: "Alex Johnson",
            headline: "Senior Software Engineer with 8+ years experience",
            location: "San Francisco, CA",
            connections: 500,
            skills: ["JavaScript", "React", "Node.js", "TypeScript"],
            experience: "8+ years",
            education: "M.S. Computer Science, Stanford University",
            profilePicture: "/images/alex-johnson.png",
            coverImage: "/images/cover-tech.jpg",
            availability: "Open to opportunities"
        },
        {
            candidateId: "2",
            name: "Sarah Miller",
            headline: "Product Manager specializing in SaaS products",
            location: "New York, NY",
            connections: 650,
            skills: ["Product Strategy", "Agile", "User Research", "Roadmapping"],
            experience: "6+ years",
            education: "MBA, Harvard Business School",
            profilePicture: "/images/sarah-miller.png",
            coverImage: "/images/cover-business.jpg",
            availability: "Actively looking"
        },
        {
            candidateId: "3",
            name: "David Chen",
            headline: "UX/UI Designer with focus on mobile applications",
            location: "Seattle, WA",
            connections: 420,
            skills: ["UI Design", "User Research", "Figma", "Adobe XD"],
            experience: "5+ years",
            education: "B.F.A. Design, RISD",
            profilePicture: "/images/david-chen.png",
            coverImage: "/images/cover-design.jpg",
            availability: "Not actively looking"
        },
    ];

    // Mock data for RightSidebarCard
    const featuredCandidates = [
        { id: "1", name: "Emma Wilson", title: "Data Scientist", skills: ["Python", "Machine Learning"] },
        { id: "2", name: "Michael Brown", title: "DevOps Engineer", skills: ["AWS", "Kubernetes"] },
    ];

    const upcomingEvents = [
        { id: "1", title: "Tech Networking Mixer", date: "2023-11-20", link: "https://techmixer.com" },
        { id: "2", title: "Career Fair 2023", date: "2023-12-10", link: "https://careerfair.com" },
    ];

    const careerResources = [
        { id: "1", title: "Resume Writing Tips", description: "Learn how to craft the perfect resume", link: "https://example.com/resume-tips" },
        { id: "2", title: "Interview Preparation", description: "Ace your next interview with these strategies", link: "https://example.com/interview-prep" },
    ];

    const trendingSkills = [
        { id: "1", title: "Machine Learning", link: "https://example.com/machine-learning" },
        { id: "2", title: "React Native", link: "https://example.com/react-native" },
    ];

    return (
        <>
            <Header />
            <SubHeader />
            <Container maxW="container.xl" py={8}>
                <HStack mb={8} px={4}>
                    <Heading size="xl" textAlign="center" color="blue.700" fontWeight="bold">Candidates</Heading>
                    <Spacer />
                    <HStack gap={4}>
                        <CandidateFilterMenu />
                        <CandidateSort />
                    </HStack>
                </HStack>
                <HStack align="start" gap={8}>
                    <VStack gap={6} align="stretch" width="75%">
                        {candidates.map((candidate) => (
                            <HStack key={candidate.candidateId} align="start" width="full">
                                <Box flex={1}>
                                    <CandidateCard
                                        name={candidate.name}
                                        headline={candidate.headline}
                                        location={candidate.location}
                                        connections={candidate.connections}
                                        skills={candidate.skills}
                                        experience={candidate.experience}
                                        education={candidate.education}
                                        profilePicture={candidate.profilePicture}
                                        availability={candidate.availability}
                                    />
                                </Box>
                                <Box>
                                    <CandidateActions />
                                </Box>
                            </HStack>
                        ))}
                    </VStack>
                    <Box width="25%">
                        <RightSidebarCard 
                            featuredCandidates={featuredCandidates} 
                            upcomingEvents={upcomingEvents} 
                            careerResources={careerResources} 
                            trendingSkills={trendingSkills} 
                        />
                    </Box>
                </HStack>
            </Container>
            <Footer />
        </>
    )
}
