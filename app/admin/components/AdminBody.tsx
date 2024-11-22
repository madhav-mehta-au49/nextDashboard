"use client"
import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useSidebar } from "../contexts/SidebarContext";

interface AdminBodyProps {
  children: ReactNode;
}

const AdminBody = ({ children }: AdminBodyProps) => {
  const { isSidebarOpen } = useSidebar();

  return (
    <Box minH="100vh" bg="gray.50" >
      <Box
        ml={isSidebarOpen ? "240px" : "0"}
        transition="margin-left 0.2s"
        pt="100px"
        px={8}
        py={20}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminBody;
