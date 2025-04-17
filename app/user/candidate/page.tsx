"use client"

import { useState } from "react"
import Footer from '../../../components/footer'
import Header from '../../web/components/header'
import SubHeader from '../../../components/subheader'
import { CandidateCard } from "../components/candidates/list/CandidateCard"
import { CandidateActions } from "../components/candidates/list/CandidateActions"
import { CandidateFilterMenu } from "../components/candidates/list/CandidateFilterMenu"
import { CandidateSort } from "../components/candidates/list/CandidateSort"
import { RightSidebarCard } from '../components/candidates/list/SideCards'
import EmployeeHeader from "@/components/EmployeeHeader"

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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <EmployeeHeader />
            <SubHeader />
            
            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 md:mb-0">
                        Candidates
                    </h1>
                    <div className="flex gap-4">
                        <CandidateFilterMenu />
                        <CandidateSort />
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Candidates List */}
                    <div className="w-full lg:w-3/4 space-y-6">
                        {candidates.map((candidate) => (
                            <div key={candidate.candidateId} className="flex flex-col md:flex-row gap-4">
                                <div className="flex-grow">
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
                                </div>
                                <div className="self-start">
                                    <CandidateActions />
                                </div>
                            </div>
                        ))}
                        
                        {/* Pagination */}
                        <div className="mt-8 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                                    Previous
                                </button>
                                <button className="px-3 py-2 rounded-md bg-blue-600 text-white">
                                    1
                                </button>
                                <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                                    2
                                </button>
                                <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                                    3
                                </button>
                                <span className="px-3 py-2 text-gray-500">...</span>
                                <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                                    10
                                </button>
                                <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                    
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4">
                        <div className="sticky top-20">
                            <RightSidebarCard
                                featuredCandidates={featuredCandidates}
                                upcomingEvents={upcomingEvents}
                                careerResources={careerResources}
                                trendingSkills={trendingSkills}
                            />
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    )
}
