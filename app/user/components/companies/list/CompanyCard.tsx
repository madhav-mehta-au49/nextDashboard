import { Badge, Box, Flex, HStack, Image, Text } from "@chakra-ui/react"
import { LuBookmark, LuBuilding, LuMessageSquare, LuShare2, LuStar } from "react-icons/lu"
import { ButtonCustom } from "@/components/ui/button-custom"
import { Rating } from "@/components/ui/rating"
import { Tooltip } from "@/components/ui/tooltip"

interface CompanyCardProps {
  name: string
  description: string
  rating: number
  industry: string
  logoUrl: string
  location: string
  hashtags: string[]
  onBookmark?: () => void
  onShare?: () => void
  onContact?: () => void
  onViewProfile?: () => void
}

export const CompanyCard = ({
  name,
  description,
  rating,
  industry,
  logoUrl,
  location,
  hashtags,
  onBookmark,
  onShare,
  onContact,
  onViewProfile
}: CompanyCardProps) => {
  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      width="full"
      bg="white"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "2xl",
        boxShadow: "0 25px 50px -12px rgba(20, 184, 166, 0.5)"
      }}
      transition="all 0.2s"
    >
      <Flex direction={{ base: "column", md: "row" }} gap={{ base: 4, md: 6 }}>
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          boxSize={{ base: "80px", md: "100px" }}
          borderRadius="lg"
          objectFit="cover"
          alignSelf={{ base: "center", md: "flex-start" }}
        />
        
        <Flex flex={1} direction="column">
          <HStack justify="space-between" mb={2}>
            <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>{name}</Text>
            <HStack gap={2}>
              <Tooltip content="Save Company">
                <ButtonCustom
                  intent="outline"
                  size="sm"
                  text="Save"
                  icon={<LuBookmark />}
                  onClick={onBookmark}
                  className="hover:scale-110 hover:bg-gray-100 hover:opacity-90 transition-all duration-200"
                />
              </Tooltip>
              <Tooltip content="Share">
                <ButtonCustom
                  intent="outline"
                  size="sm"
                  text="Share"
                  icon={<LuShare2 />}
                  onClick={onShare}
                  className="hover:scale-110 hover:bg-gray-100 hover:opacity-90 transition-all duration-200"
                />
              </Tooltip>
            </HStack>
          </HStack>

          <HStack gap={2} mb={2}>
            {hashtags.map((hashtag, index) => (
              <Badge key={index} colorScheme="teal" borderRadius="full" px={2} py={1}>
                #{hashtag}
              </Badge>
            ))}
          </HStack>

          <HStack align="center" mb={2}>
            <LuStar />
            <Rating
              value={rating}
              readOnly
              size="sm"
            />
          </HStack>
          <Text color="gray.600" mt={2}>{description}</Text>
          <Text color="blue.500" fontSize="sm" mt={2}>{industry}</Text>
          <Text color="gray.500" fontSize="sm" mt={1}>{location}</Text>

          <HStack mt={4} gap={3} justify={{ base: "center", md: "flex-start" }}>
            <ButtonCustom
              intent="solid"
              size="sm"
              text="View Profile"
              icon={<LuBuilding />}
              onClick={onViewProfile}
              className="hover:scale-110 hover:bg-gray-100 hover:opacity-90 transition-all duration-200"
            />
            <ButtonCustom
              intent="outline"
              size="sm"
              text="Contact"
              icon={<LuMessageSquare />}
              onClick={onContact}
              className="hover:scale-110 hover:bg-gray-100 hover:opacity-90 transition-all duration-200"
            />
          </HStack>
        </Flex>
      </Flex>
    </Box>
  )
}
