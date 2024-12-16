import { Badge, Card, HStack, Image, Text, VStack } from "@chakra-ui/react"
import Link from "next/link"
import { FiBox, FiEye, FiMapPin, FiTrendingUp, FiUsers } from "react-icons/fi"
import { ButtonCustom } from "@/components/ui/button-custom"

interface HorizontalCompanyCardProps {
    name: string
    description: string
    companyId: string
    industry: string
    location?: string
    employeeCount?: string
    logoUrl?: string
    growthRate?: string
}

export const HorizontalCompanyCard = ({
    name,
    description,
    companyId,
    industry,
    location = "Remote",
    employeeCount = "1-50",
    logoUrl = "/company-placeholder.png",
    growthRate = "+20%"
}: HorizontalCompanyCardProps) => {
    return (
        <Card.Root
            width="100%"
            display="flex"
            flexDirection="row"
            variant="elevated"
            bg="white"
            borderColor="gray.200"
            borderWidth="1px"
            _hover={{
                transform: "translateY(-4px)",
                shadow: "2xl",
                boxShadow: "0 25px 50px -12px #14B8A6"
            }}
            transition="all 0.2s"
        >
            <HStack gap={6} p={6}>
                <Image
                    src={logoUrl}
                    alt={`${name} logo`}
                    boxSize="80px"
                    objectFit="cover"
                    borderRadius="lg"
                />
                <Card.Body flex="1" gap="4">
                    <VStack align="start" gap={3}>
                        <Card.Title fontSize="xl" fontWeight="bold">
                            {name}
                        </Card.Title>

                        <HStack gap={4}>
                            <Badge colorScheme="blue">{industry}</Badge>
                            <HStack gap={1}>
                                <FiMapPin />
                                <Text fontSize="sm">{location}</Text>
                            </HStack>
                            <HStack gap={1}>
                                <FiUsers />
                                <Text fontSize="sm">{employeeCount} employees</Text>
                            </HStack>
                            <HStack gap={1} color="green.500">
                                <FiTrendingUp />
                                <Text fontSize="sm">{growthRate} growth</Text>
                            </HStack>
                        </HStack>

                        <Card.Description color="gray.600" noOfLines={2}>
                            {description}
                        </Card.Description>
                    </VStack>
                </Card.Body>
            </HStack>

            <Card.Footer
                display="flex"
                flexDirection="column"
                justifyContent="center"
                gap={4}
                p={6}
                borderLeft="1px"
                borderColor="gray.200"
            >
                <Link href={`/companies/${companyId}`}>
                    <ButtonCustom
                        intent="solid"
                        size="md"
                        text="View Company"
                        width="full"
                    >
                        <FiEye className="size-3.5" />
                    </ButtonCustom>
                </Link>
                <Link href={`/companies/${companyId}/jobs`}>
                    <ButtonCustom
                        intent="outline"
                        size="md"
                        text="View Jobs"
                        width="full"
                    >
                        <FiBox className="size-3.5" />
                    </ButtonCustom>
                </Link>

            </Card.Footer>
        </Card.Root>
    )
}