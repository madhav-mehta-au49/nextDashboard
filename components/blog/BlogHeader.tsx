import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";

interface BlogHeaderProps {
  title: string;
  description?: string;
}

const BlogHeader: FC<BlogHeaderProps> = ({ title, description }) => {
  return (
    <Box bg="gray.50" py={16}>
      <Container maxW="4xl">
        <VStack gap={4} align="center" textAlign="center">
          <Heading size="2xl" color="gray.800">
            {title}
          </Heading>
          {description && (
            <Text fontSize="xl" color="gray.600" maxW="2xl">
              {description}
            </Text>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default BlogHeader;
