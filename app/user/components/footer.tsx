import { EmailIcon, ExternalLinkIcon, InfoIcon, LockIcon, PhoneIcon, WarningIcon } from '@chakra-ui/icons';
import { Box, Container, Flex, Grid, Heading, HStack, Icon, Link, Separator, Text, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import type { FooterSection } from '../types/footer';

const footerSections: FooterSection[] = [
    {
        title: "About Company",
        links: [
            { label: "About Us", href: "/about", icon: <InfoIcon /> },
            { label: "Careers", href: "/careers", icon: <ExternalLinkIcon /> },
            { label: "Employer Home", href: "/employer", icon: <ExternalLinkIcon /> },
            { label: "Sitemap", href: "/sitemap", icon: <ExternalLinkIcon /> },
        ],
    },
    {
        title: "For Job Seekers",
        links: [
            { label: "Browse Jobs", href: "/jobs", icon: <ExternalLinkIcon /> },
            { label: "Companies", href: "/companies", icon: <ExternalLinkIcon /> },
            { label: "Saved Jobs", href: "/saved-jobs", icon: <ExternalLinkIcon /> },
            { label: "Job Alerts", href: "/job-alerts", icon: <ExternalLinkIcon /> },
        ],
    },
    {
        title: "Help & Support",
        links: [
            { label: "Help Center", href: "/help", icon: <PhoneIcon /> },
            { label: "Grievances", href: "/grievances", icon: <WarningIcon /> },
            { label: "Report Issue", href: "/report", icon: <WarningIcon /> },
            { label: "Trust & Safety", href: "/trust-safety", icon: <LockIcon /> },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", href: "/privacy", icon: <LockIcon /> },
            { label: "Terms & Conditions", href: "/terms", icon: <LockIcon /> },
            { label: "Fraud Alert", href: "/fraud-alert", icon: <WarningIcon /> },
            { label: "Contact Us", href: "/contact", icon: <EmailIcon /> },
        ],
    },
];

const Footer: React.FC = () => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const headingColor = useColorModeValue('gray.700', 'white');
    const linkHoverColor = useColorModeValue('blue.500', 'blue.300');


    return (
        <Box as="footer" bg={bgColor} color={textColor}>
            <Container maxW="1200px" py={10}>
                <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
                    gap={8}
                >
                    {footerSections.map((section) => (
                        <VStack key={section.title} align="flex-start" gap={4}>
                            <Heading size="sm" color={headingColor}>
                                {section.title}
                            </Heading>
                            <VStack align="flex-start" gap={2}>
                                {section.links.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        display="flex"
                                        alignItems="center"
                                        gap={2}
                                        _hover={{ color: linkHoverColor }}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </Link>
                                ))}
                            </VStack>
                        </VStack>
                    ))}
                </Grid>

                <Separator my={8} borderColor={borderColor} />

                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                    gap={4}
                >
                    <Text fontSize="sm">
                        © {new Date().getFullYear()} JobPortal. All rights reserved.
                    </Text>
                    <HStack gap={4} wrap="wrap" justify={{ base: "center", md: "flex-end" }}>
                        <Link href="/privacy" fontSize="sm">Privacy</Link>
                        <Link href="/terms" fontSize="sm">Terms</Link>
                        <Link href="/cookies" fontSize="sm">Cookies</Link>
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
};

export default Footer;