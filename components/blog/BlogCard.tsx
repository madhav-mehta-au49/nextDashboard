import { Box, Image, Text, Stack, HStack } from "@chakra-ui/react";
import { FC } from "react";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";

interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  slug: string;
  tags?: string[];
}

const BlogCard: FC<BlogCardProps> = ({ title, description, date, imageUrl, slug, tags }) => {
  return (
    <Link href={`/blog/${slug}`} passHref>
      <Box
        as="article"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
        transition="all 0.2s"
        cursor="pointer"
      >
        <Image
          src={imageUrl}
          alt={title}
          width="100%"
          height="200px"
          objectFit="cover"
        />
        <Stack direction="column" p={6} align="start" gap={3}>
          <Text fontSize="sm" color="gray.500">
            {date}
          </Text>
          <Text fontSize="xl" fontWeight="semibold" lineHeight="short">
            {title}
          </Text>
          <Text color="gray.600" lineClamp={3}>
            {description}
          </Text>
          {tags && tags.length > 0 && (
            <HStack gap={2}>
              {tags.map((tag) => (
                <Tag key={tag} size="sm" colorScheme="blue">
                  {tag}
                </Tag>
              ))}
            </HStack>
          )}
        </Stack>
      </Box>
    </Link>
  );
};

export default BlogCard;
