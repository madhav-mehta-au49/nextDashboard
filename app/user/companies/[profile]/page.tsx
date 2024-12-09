import { Box, Container } from "@chakra-ui/react";
import Footer from "../../../user/components/footer";
import EmployeeHeader from "../../../user/components/header";
import SubHeader from "../../../user/components/subheader";
import CompanyDescription from "../../components/companies/companyDescription";

export default function CompanyProfile({ params }: { params: { profile: string } }) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box as="section">
        <EmployeeHeader />
      </Box>
      <Box as="section">
        <SubHeader />
      </Box>
      <Box as="main" flex="1">
        <Container maxW="7xl" py={8}>
          <Box as="section">
            <CompanyDescription companyId={params.profile} />
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}