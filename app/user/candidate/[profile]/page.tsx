// pages/candidate-profile.js

import {
    Box,
    Flex,
    Avatar,
    Button,
    Heading,
    Text,
    IconButton,
    Stack,
    Divider,
    Link as ChakraLink,
    SimpleGrid,
    List,
    ListItem,
    ListIcon,
    Collapse,
    useDisclosure,
  } from '@chakra-ui/react';
  import { EditIcon, ExternalLinkIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
  import { FaBriefcase, FaSchool } from 'react-icons/fa';
  import { MdCheckCircle } from 'react-icons/md';
  
  export default function CandidateProfile() {
    // For toggling "see more" content in about/summary
    const { isOpen: isAboutOpen, onToggle: toggleAbout } = useDisclosure();
  
    // Mock data
    const candidateData = {
      name: 'Jane Doe',
      headline: 'Senior UX/UI Designer at Creative Studio',
      location: 'San Francisco Bay Area',
      profilePicture: '/images/avatar.jpg', // replace with an actual image
      coverImage: '/images/cover.jpg',       // replace with an actual cover image
      about:
        "Passionate UX/UI designer with 8+ years of experience in creating intuitive user experiences and visually appealing interfaces. Skilled in Next.js, React, Chakra UI, design systems, and rapid prototyping. A firm believer in user-centered design and continuous improvement, with a background in marketing and user research.",
      experience: [
        {
          title: 'Senior UX/UI Designer',
          company: 'Creative Studio',
          duration: 'Jan 2021 - Present',
          location: 'San Francisco, CA',
          details: [
            'Led the design of a new suite of enterprise design systems',
            'Collaborated cross-functionally to implement feedback loops and design reviews',
            'Mentored junior designers in best UI/UX practices',
          ],
        },
        {
          title: 'UI Designer',
          company: 'Tech Innovations Inc.',
          duration: 'Jun 2017 - Dec 2020',
          location: 'Remote',
          details: [
            'Built prototypes and wireframes for a variety of web applications',
            'Conducted user research to inform design decisions',
            'Optimized design workflows and processes',
          ],
        },
      ],
      education: [
        {
          institution: 'University of Design',
          degree: 'B.A. in Graphic Design',
          duration: '2013 - 2017',
        },
      ],
      featured: [
        {
          title: 'Personal Portfolio',
          url: 'https://portfolio.example.com',
          description: 'My recent design portfolio showcasing top projects.',
        },
        {
          title: 'Dribbble Shots',
          url: 'https://dribbble.com/janedoe',
          description: 'A collection of UI concepts and visual explorations.',
        },
      ],
      skills: [
        { skill: 'UX Research', endorsements: 10 },
        { skill: 'Wireframing', endorsements: 25 },
        { skill: 'Prototyping', endorsements: 15 },
        { skill: 'Chakra UI', endorsements: 5 },
        { skill: 'Next.js', endorsements: 8 },
      ],
      recommendations: [
        {
          name: 'John Smith',
          relation: 'Former Manager at Tech Innovations Inc.',
          text: "Jane is an exceptional designer who's able to combine creativity with user-centric thinking. She was a valuable asset to our team, consistently delivering top-notch design solutions.",
        },
        {
          name: 'Laura Johnson',
          relation: 'Project Lead at Creative Studio',
          text: "Working with Jane has been a pleasure. Her attention to detail and her ability to iterate quickly based on feedback helped us launch our product on time and with great user satisfaction.",
        },
      ],
      connections: 500,
    };
  
    return (
      <Box maxW="100%" bgColor="gray.50" minH="100vh">
        {/* Cover Photo Section */}
        <Box
          position="relative"
          bgImage={`url(${candidateData.coverImage})`}
          bgSize="cover"
          bgPos="center"
          height="200px"
        >
          <Box
            position="absolute"
            bottom="-50px"
            left="50px"
            bg="white"
            p={1}
            borderRadius="full"
            boxShadow="lg"
          >
            <Avatar
              size="2xl"
              name={candidateData.name}
              src={candidateData.profilePicture}
            />
          </Box>
        </Box>
  
        {/* Header with name & headline */}
        <Box pt={16} px={8}>
          <Flex justify="space-between" align="start" flexDir={['column', null, 'row']}>
            <Box>
              <Heading fontSize="2xl" mb={1}>
                {candidateData.name}
              </Heading>
              <Text fontSize="md" color="gray.600">
                {candidateData.headline}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {candidateData.location} • {candidateData.connections}+ connections
              </Text>
            </Box>
            <Stack direction="row" spacing={3} mt={[4, null, 0]}>
              <Button colorScheme="blue">Connect</Button>
              <Button variant="outline" colorScheme="blue">
                Message
              </Button>
              <IconButton
                aria-label="More options"
                icon={<EditIcon />}
                variant="outline"
                colorScheme="blue"
              />
            </Stack>
          </Flex>
        </Box>
  
        {/* About / Summary Section */}
        <Box mt={8} px={8} py={4} bg="white" boxShadow="sm" borderRadius="md">
          <Heading fontSize="lg" mb={2}>
            About
          </Heading>
          <Collapse startingHeight={40} in={isAboutOpen}>
            <Text fontSize="sm" color="gray.700">
              {candidateData.about}
            </Text>
          </Collapse>
          <Button
            size="sm"
            variant="link"
            colorScheme="blue"
            onClick={toggleAbout}
            rightIcon={isAboutOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            mt={2}
          >
            Show {isAboutOpen ? 'Less' : 'More'}
          </Button>
        </Box>
  
        {/* Featured Section */}
        <Box mt={4} px={8} py={4} bg="white" boxShadow="sm" borderRadius="md">
          <Heading fontSize="lg" mb={4}>
            Featured
          </Heading>
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            {candidateData.featured.map((item, idx) => (
              <Box
                key={idx}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                p={4}
                bg="gray.50"
              >
                <Heading fontSize="md" mb={1}>
                  {item.title}
                </Heading>
                <Text fontSize="sm" color="gray.700" mb={2}>
                  {item.description}
                </Text>
                <ChakraLink
                  href={item.url}
                  color="blue.600"
                  isExternal
                >
                  View <ExternalLinkIcon mx="2px" />
                </ChakraLink>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
  
        {/* Experience Section */}
        <Box mt={4} px={8} py={4} bg="white" boxShadow="sm" borderRadius="md">
          <Flex align="center" mb={4}>
            <FaBriefcase color="gray.500" size="1.25rem" />
            <Heading fontSize="lg" ml={2}>
              Experience
            </Heading>
          </Flex>
          <Divider />
          {candidateData.experience.map((exp, idx) => (
            <Box key={idx} mt={4}>
              <Heading fontSize="md">{exp.title}</Heading>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                {exp.company}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {exp.duration} • {exp.location}
              </Text>
              <List spacing={1} mt={2} styleType="disc" pl={4}>
                {exp.details.map((detail, index) => (
                  <ListItem key={index} fontSize="sm" color="gray.700">
                    {detail}
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>
  
        {/* Education Section */}
        <Box mt={4} px={8} py={4} bg="white" boxShadow="sm" borderRadius="md">
          <Flex align="center" mb={4}>
            <FaSchool color="gray.500" size="1.25rem" />
            <Heading fontSize="lg" ml={2}>
              Education
            </Heading>
          </Flex>
          <Divider />
          {candidateData.education.map((edu, idx) => (
            <Box key={idx} mt={4}>
              <Heading fontSize="md">{edu.institution}</Heading>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                {edu.degree}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {edu.duration}
              </Text>
            </Box>
          ))}
        </Box>
  
        {/* Skills & Endorsements Section */}
        <Box mt={4} px={8} py={4} bg="white" boxShadow="sm" borderRadius="md">
          <Heading fontSize="lg" mb={4}>
            Skills & Endorsements
          </Heading>
          <Stack spacing={2}>
            {candidateData.skills.map((skillItem, idx) => (
              <Flex key={idx} align="center" justify="space-between">
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    {skillItem.skill}
                  </Text>
                </Box>
                <Flex align="center">
                  <ListIcon as={MdCheckCircle} color="blue.500" />
                  <Text fontSize="sm" ml={1} color="gray.600">
                    {skillItem.endorsements}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Stack>
        </Box>
  
        {/* Recommendations Section */}
        <Box mt={4} px={8} py={4} bg="white" boxShadow="sm" borderRadius="md">
          <Heading fontSize="lg" mb={4}>
            Recommendations
          </Heading>
          {candidateData.recommendations.map((rec, idx) => (
            <Box key={idx} mb={4}>
              <Text fontWeight="bold" color="gray.700">
                {rec.name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {rec.relation}
              </Text>
              <Text fontSize="sm" color="gray.700" mt={2}>
                "{rec.text}"
              </Text>
            </Box>
          ))}
        </Box>
  
        {/* Footer or Additional Sections (Interests, etc.) */}
        <Box mt={8} textAlign="center" pb={8}>
          <Text fontSize="xs" color="gray.500">
            © {new Date().getFullYear()} LinkedIn-like Demo. All rights reserved.
          </Text>
        </Box>
      </Box>
    );
  }
  