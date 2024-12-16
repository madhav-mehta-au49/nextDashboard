import { Box, Container, Heading, HStack, Spacer, VStack } from "@chakra-ui/react"
import { CompanyActions } from "@/app/user/components/companies/list/CompanyActions"
import { CompanyFilterMenu } from "@/app/user/components/companies/list/CompanyFilterMenu"
import { CompanySort } from "@/app/user/components/companies/list/CompanySort"
import { RightSidebarCard } from '@/app/user/components/companies/list/SideCards'; 
import Footer from '@/app/user/components/footer'
import Header from '@/app/user/components/header'
import SubHeader from '@/app/user/components/subheader'
import { CompanyCard } from "../components/companies/list/CompanyCard"
export default function CompaniesPage() {
    const companies = [
        {
            companyId: "1",
            name: "Tech Corp",
            description: "Leading technology solutions provider with global reach",
            industry: "Technology",
            rating: 4.5,
            logoUrl: "/images/tech-corp-logo.png",
            location: "San Francisco, CA",
            hashtags: ["Technology", "Innovation", "Software"]
        },
        {
            companyId: "2",
            name: "Health Solutions",
            description: "Innovative healthcare technology and services",
            industry: "Healthcare",
            rating: 4.2,
            logoUrl: "/images/health-solutions-logo.png",
            location: "Boston, MA",
            hashtags: ["Healthcare", "MedTech", "Innovation"]
        },
        {
            companyId: "3",
            name: "FinTech Pro",
            description: "Next-generation financial services platform",
            industry: "Finance",
            rating: 4.8,
            logoUrl: "/images/fintech-pro-logo.png",
            location: "New York, NY",
            hashtags: ["Finance", "Banking", "Technology"]
        },
        
    ];
        // Mock data for RightSidebarCard
        const testimonials = [
            { id: "1", user: "John Doe", feedback: "Great company to work with!" },
            { id: "2", user: "Jane Smith", feedback: "Innovative solutions and excellent support." },
        ];
    
        const events = [
            { id: "1", title: "Tech Conference 2023", date: "2023-11-15", link: "https://techconference.com" },
            { id: "2", title: "Healthcare Summit", date: "2023-12-05", link: "https://healthcaresummit.com" },
        ];
     // Mock data for feedItems
     const feedItems = [
        { id: "1", title: "New Product Launch", description: "We are excited to announce our new product.", date: "2023-10-01", link: "https://example.com/product-launch" },
        { id: "2", title: "Quarterly Earnings", description: "Our quarterly earnings report is now available.", date: "2023-09-15", link: "https://example.com/earnings" },
    ];

    // Mock data for trendingBlogs
    const trendingBlogs = [
        { id: "1", title: "The Future of Tech", link: "https://example.com/future-of-tech" },
        { id: "2", title: "Healthcare Innovations", link: "https://example.com/healthcare-innovations" },
    ];

    return (
        <>
            <Header />
            <SubHeader />
            <Container maxW="container.xl" py={8}>
                <HStack mb={8} px={4}>
                    <Heading size="xl" textAlign="center" color="blue.700" fontWeight="bold">Companies</Heading>
                    <Spacer />
                    <HStack gap={4}>
                        <CompanyFilterMenu />
                        <CompanySort />
                    </HStack>
                </HStack>
                <HStack align="start" gap={8}>
                    <VStack gap={6} align="stretch" width="75%">
                        {companies.map((company) => (
                            <HStack key={company.companyId} align="start" width="full">
                                <Box flex={1}>
                                    <CompanyCard
                                        name={company.name}
                                        description={company.description}
                                        rating={company.rating}
                                        industry={company.industry}
                                        logoUrl={company.logoUrl}
                                        location={company.location}
                                        hashtags={company.hashtags}
                                    />
                                </Box>
                                <Box>
                                    <CompanyActions />
                                </Box>
                            </HStack>
                        ))}
                    </VStack>
                    <Box width="25%">
                        <RightSidebarCard testimonials={testimonials} events={events} feedItems={feedItems} trendingBlogs={trendingBlogs} />
                    </Box>
                </HStack>
            </Container>
            <Footer />
        </>
    )
}