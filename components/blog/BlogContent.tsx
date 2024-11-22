import { Box, Container, Heading, Image, Text, VStack, HStack } from "@chakra-ui/react";
import { FC } from "react";
import { Tag } from "@/components/ui/tag";

interface BlogContentProps {
  title: string;
  content: string;
  date: string;
  imageUrl: string;
  author: string;
  tags?: string[];
  readTime?: string;
}

const BlogContent: FC<BlogContentProps> = ({
  title,
  content,
  date,
  imageUrl,
  author,
  tags,
  readTime,
}) => {
  return (
    <Container maxW="4xl" py={8}>
      <VStack gap={6} align="stretch">
        <Image
          src={imageUrl}
          alt={title}
          borderRadius="lg"
          width="100%"
          height="400px"
          objectFit="cover"
        />
        
        <VStack align="start" gap={4}>
          <HStack gap={4}>
            <Text color="gray.500">{date}</Text>
            {readTime && <Text color="gray.500">·</Text>}
            {readTime && <Text color="gray.500">{readTime} min read</Text>}
          </HStack>

          <Heading size="2xl">{title}</Heading>
          
          <HStack>
            <Text color="gray.600">By {author}</Text>
          </HStack>

          {tags && tags.length > 0 && (
            <HStack gap={2}>
              {tags.map((tag) => (
                <Tag key={tag} size="sm" colorScheme="blue">
                  {tag}
                </Tag>
              ))}
            </HStack>
          )}
        </VStack>

        <Box
          as="article"
          fontSize="lg"
          lineHeight="tall"
          color="gray.700"
          css={{
            'p': {
              marginBottom: '1rem'
            },
            'h2': {
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginTop: '2rem',
              marginBottom: '1rem'
            },
            'h3': {
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginTop: '1.5rem',
              marginBottom: '0.75rem'
            }
          }}
        >
          {content}
        </Box>
      </VStack>
    </Container>
  );
};

export default BlogContent;
