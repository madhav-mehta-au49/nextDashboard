import { Card, GridItem } from "@chakra-ui/react"
import { StatHelpText, StatLabel, StatRoot, StatValueText } from "../../../../components/ui/stat"

interface DashboardCardProps {
  label: string
  value: string | number
  helpText: string
}

const DashboardCard = ({ label, value, helpText }: DashboardCardProps) => {
  return (
    <GridItem>
      <Card.Root>
        <Card.Body p={6}>
          <StatRoot>
            <StatLabel>{label}</StatLabel>
            <StatValueText>{value}</StatValueText>
            <StatHelpText>{helpText}</StatHelpText>
          </StatRoot>
        </Card.Body>
      </Card.Root>
    </GridItem>
  )
}

export default DashboardCard