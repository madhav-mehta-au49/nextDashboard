
import { Card, Text } from "@chakra-ui/react"
import Link from "next/link"
import { FiEye, FiSend } from "react-icons/fi"
// import { ButtonCustom } from "@/components/ui/button-custom"

export const HorizontalJobCard = ({ title, description, jobId }: { title: string; description: string; jobId: string }) => {
  return (
    <Card.Root
      width="100%"
      display="flex"
      flexDirection="row"
      variant="elevated"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "2xl",
        boxShadow: "0 25px 50px -12px #14B8A6"
      }}
      transition="all 0.2s"
    >
      <Card.Body flex="1" gap="4" p={6}>
        <Card.Title
          fontSize="xl"
          fontWeight="bold"
          mb="4"
          lineHeight="1.4"
        >
          <Text noOfLines={2}>
            {title}
          </Text>
        </Card.Title>
        <Card.Description
          color="gray.600"
          fontSize="md"
          lineHeight="1.6"
        >
          <Text noOfLines={3}>
            {description}
          </Text>
        </Card.Description>
      </Card.Body>
      <Card.Footer
        display="flex"
        alignItems="center"
        gap={4}
        p={6}
        borderLeft="1px"
        borderColor="gray.100"
      >
        <Link href={`/jobs/${jobId}`}>
          <ButtonCustom
            intent="outline"
            size="sm"
            text="View Details"
            icon={<FiEye className="size-3.5" />}
          />
        </Link>
        <Link href={`/jobs/${jobId}/apply`}>
          <ButtonCustom
            intent="solid"
            size="sm"
            text="Apply Now"
            icon={<FiSend className="size-3.5" />}
          />
        </Link>
      </Card.Footer>
    </Card.Root>
  )
}
