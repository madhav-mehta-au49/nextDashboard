"use client"

import React from "react";
import { CompanyActions } from "./components/directory/CompanyActions";
import { CompanyFilterMenu } from "./components/directory/CompanyFilterMenu";
import { CompanySort } from "./components/directory/CompanySort";
import { RightSidebarCard } from "./components/directory/SideCards";
import Footer from '@/components/footer';
import SubHeader from '@/components/subheader';
import { CompanyCard } from "./components/directory/CompanyCard";
import Link from "next/link";
import Header from "../web/components/header";
import EmployeeHeader from "@/components/EmployeeHeader";

export default function CompaniesPage() {
    const companies = [
        {
            companyId: "1",
            name: "TechCorp Solutions",
            description: "Leading provider of innovative software solutions for enterprise businesses. Specializing in AI-driven analytics, cloud migration, and digital transformation.",
            rating: 4.5,
            industry: "Information Technology",
            logoUrl: "/images/techcorp-logo.png",
            location: "San Francisco, CA",
            hashtags: ["Technology", "Software", "AI"]
        },
        {
            companyId: "2",
            name: "HealthPlus Medical",
            description: "Revolutionary healthcare technology company focused on improving patient outcomes through digital health solutions and telemedicine platforms.",
            rating: 4.2,
            industry: "Healthcare",
            logoUrl: "/images/healthplus-logo.png",
            location: "Boston, MA",
            hashtags: ["Healthcare", "Telemedicine", "Digital Health"]
        },
        {
            companyId: "3",
            name: "GreenEarth Sustainability",
            description: "Environmental consulting firm helping businesses reduce their carbon footprint and implement sustainable practices across their operations.",
            rating: 4.7,
            industry: "Environmental Services",
            logoUrl: "/images/greenearth-logo.png",
            location: "Portland, OR",
            hashtags: ["Sustainability", "Environment", "Green Energy"]
        },
    ];

    // Mock data for RightSidebarCard
    const testimonials = [
        { id: "1", user: "John Smith", feedback: "Found my dream job through this platform!" },
        { id: "2", user: "Sarah Johnson", feedback: "The company profiles are detailed and accurate." },
    ];

    const events = [
        { id: "1", title: "Tech Career Fair", date: "2023-11-15", location: "Virtual" },
        { id: "2", title: "Networking Mixer", date: "2023-11-20", location: "New York" },
    ];

    const feedItems = [
        { id: "1", title: "TechCorp is hiring!", content: "10 new positions open", time: "2 hours ago" },
        { id: "2", title: "HealthPlus featured in Forbes", content: "Recognized for innovation", time: "1 day ago" },
        { id: "3", title: "GreenEarth wins sustainability award", content: "Industry recognition", time: "3 days ago" },
    ];

    const trendingBlogs = [
        { id: "1", title: "How to Stand Out in Tech Interviews", link: "/blog/tech-interviews", href: "/blog/tech-interviews" },
        { id: "2", title: "The Future of Remote Work", link: "/blog/remote-work-future", href: "/blog/remote-work-future" },
    ];

    return (
        <>
            <Header />
            <EmployeeHeader />
            <SubHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Company Creation CTA Banner */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 mb-8 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Represent your company?</h2>
                            <p className="text-teal-100">Create a company profile to attract top talent and showcase your brand.</p>
                        </div>
                        <Link
                            href="/companies/create"
                            className="mt-4 md:mt-0 px-6 py-3 bg-white text-teal-600 hover:bg-teal-50 font-medium rounded-md shadow-sm transition-colors"
                        >
                            Create Company Profile
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4">
                    <h1 className="text-2xl font-bold text-teal-700 mb-4 md:mb-0">Companies</h1>
                    <div className="flex gap-4">
                        <CompanyFilterMenu />
                        <CompanySort />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-3/4 space-y-6">
                        {companies.map((company) => (
                            <div key={company.companyId} className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <CompanyCard
                                        name={company.name}
                                        description={company.description}
                                        rating={company.rating}
                                        industry={company.industry}
                                        logoUrl={company.logoUrl}
                                        location={company.location}
                                        hashtags={company.hashtags}
                                        onBookmark={() => console.log(`Bookmark ${company.name}`)}
                                        onShare={() => console.log(`Share ${company.name}`)}
                                        onContact={() => console.log(`Contact ${company.name}`)}
                                        onViewProfile={() => console.log(`View ${company.name} profile`)}
                                    />
                                </div>
                                <div className="hidden md:block">
                                    <CompanyActions />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full lg:w-1/4">
                        <RightSidebarCard
                            testimonials={testimonials}
                            events={events}
                            feedItems={feedItems}
                            trendingBlogs={trendingBlogs}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
