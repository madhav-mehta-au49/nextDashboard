import { Badge, Box, Heading, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { FiFacebook, FiLinkedin, FiTwitter } from "react-icons/fi";
import FeedCard from '../../feeds'; // Adjust the import path as necessary

interface Testimonial {
    id: string;
    user: string;
    feedback: string;
}

interface Event {
    id: string;
    title: string;
    date: string;
    link: string;
}

interface RightSidebarCardProps {
    testimonials: Testimonial[];
    events: Event[];
    feedItems: FeedItem[]; // Add this prop to pass feed items
    trendingBlogs: BlogItem[]; // Add this prop to pass trending blogs
}

export const RightSidebarCard: React.FC<RightSidebarCardProps> = ({ testimonials, events, feedItems, trendingBlogs }) => {
    return (
        <Box
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            p={6}
            width="full"
            maxW="sm"
            boxShadow="0 25px 50px -12px rgba(20, 184, 166, 0.5)"
            _hover={{
                transform: "translateY(-4px)",
                shadow: "2xl",
                boxShadow: "0 25px 50px -12px rgba(20, 184, 166, 0.5)"
            }}
            transition="all 0.2s"
        >
            <Heading size="md" mb={4} color="blue.700">News Feed</Heading>
            <FeedCard feedItems={feedItems} />

            <Box height="1px" bg="gray.200" mb={6} />

            <Heading size="md" mb={4} color="blue.700">Trending Blogs</Heading>
            <VStack align="start" gap={3} mb={6}>
                {trendingBlogs.map((blog) => (
                    <Box key={blog.id}>
                        <Text fontWeight="bold">{blog.title}</Text>
                        <Link href={blog.link} color="teal.500" isExternal>Read More</Link>
                    </Box>
                ))}
            </VStack>

            <Box height="1px" bg="gray.200" mb={6} />

            <Heading size="md" mb={4} color="blue.700">Testimonials</Heading>
            <VStack align="start" gap={3} mb={6}>
                {testimonials.map((testimonial) => (
                    <Box key={testimonial.id}>
                        <Text fontWeight="bold">{testimonial.user}</Text>
                        <Text fontSize="sm" color="gray.600">“{testimonial.feedback}”</Text>
                    </Box>
                ))}
            </VStack>

            <Box height="1px" bg="gray.200" mb={6} />

            <Heading size="md" mb={4} color="blue.700">Upcoming Events</Heading>
            <VStack align="start" gap={3} mb={6}>
                {events.map((event) => (
                    <Box key={event.id}>
                        <Text fontWeight="bold">{event.title}</Text>
                        <Text fontSize="sm" color="gray.600">{event.date}</Text>
                        <Link href={event.link} color="teal.500" isExternal>Learn More</Link>
                    </Box>
                ))}
            </VStack>

            <Box height="1px" bg="gray.200" mb={6} />

            <Heading size="md" mb={4} color="blue.700">Follow Us</Heading>
            <HStack gap={4}>
                <Link href="https://twitter.com" isExternal>
                    <FiTwitter size={24} color="blue.500" />
                </Link>
                <Link href="https://facebook.com" isExternal>
                    <FiFacebook size={24} color="blue.500" />
                </Link>
                <Link href="https://linkedin.com" isExternal>
                    <FiLinkedin size={24} color="blue.500" />
                </Link>
            </HStack>
        </Box>
    );
}
