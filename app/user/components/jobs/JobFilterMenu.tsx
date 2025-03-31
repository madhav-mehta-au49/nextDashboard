import { FiFilter } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  MenuCheckboxItem,
  MenuContent,
  MenuItemGroup,
  MenuRoot,
  MenuSeparator,
  MenuTrigger
} from "@/components/ui/menu";

export const JobFilterMenu = () => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="outline">
          <FiFilter className="mr-2 size-4" />
          Filters
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItemGroup title="Job Type">
          <MenuCheckboxItem value="full-time">Full-time</MenuCheckboxItem>
          <MenuCheckboxItem value="part-time">Part-time</MenuCheckboxItem>
          <MenuCheckboxItem value="contract">Contract</MenuCheckboxItem>
          <MenuCheckboxItem value="internship">Internship</MenuCheckboxItem>
        </MenuItemGroup>
        <MenuSeparator />
        <MenuItemGroup title="Location">
          <MenuCheckboxItem value="remote">Remote</MenuCheckboxItem>
          <MenuCheckboxItem value="on-site">On-site</MenuCheckboxItem>
          <MenuCheckboxItem value="hybrid">Hybrid</MenuCheckboxItem>
        </MenuItemGroup>
        <MenuSeparator />
        <MenuItemGroup title="Experience Level">
          <MenuCheckboxItem value="entry-level">Entry Level (0-2 years)</MenuCheckboxItem>
          <MenuCheckboxItem value="mid-level">Mid Level (3-5 years)</MenuCheckboxItem>
          <MenuCheckboxItem value="senior-level">Senior Level (6+ years)</MenuCheckboxItem>
          <MenuCheckboxItem value="executive">Executive (10+ years)</MenuCheckboxItem>
        </MenuItemGroup>
        <MenuSeparator />
        <MenuItemGroup title="Skills">
          <MenuCheckboxItem value="javascript">JavaScript</MenuCheckboxItem>
          <MenuCheckboxItem value="python">Python</MenuCheckboxItem>
          <MenuCheckboxItem value="react">React</MenuCheckboxItem>
          <MenuCheckboxItem value="product-management">Product Management</MenuCheckboxItem>
          <MenuCheckboxItem value="ui-ux-design">UI/UX Design</MenuCheckboxItem>
        </MenuItemGroup>
      </MenuContent>
    </MenuRoot>
  );
};