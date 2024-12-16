import { LuFilter } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import {
    MenuCheckboxItem,
    MenuContent,
    MenuItemGroup,
    MenuRoot,
    MenuSeparator,
    MenuTrigger
  } from "@/components/ui/menu"
  
  export const CompanyFilterMenu = () => {
    return (
      <MenuRoot>
        <MenuTrigger asChild>
          <Button variant="outline">
            <LuFilter className="mr-2 size-4" />
            Filters
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItemGroup title="Industry">
            <MenuCheckboxItem value="tech">Technology</MenuCheckboxItem>
            <MenuCheckboxItem value="health">Healthcare</MenuCheckboxItem>
            <MenuCheckboxItem value="finance">Finance</MenuCheckboxItem>
          </MenuItemGroup>
          <MenuSeparator />
          <MenuItemGroup title="Company Size">
            <MenuCheckboxItem value="startup">1-50</MenuCheckboxItem>
            <MenuCheckboxItem value="small">51-200</MenuCheckboxItem>
            <MenuCheckboxItem value="medium">201-1000</MenuCheckboxItem>
            <MenuCheckboxItem value="large">1000+</MenuCheckboxItem>
          </MenuItemGroup>
        </MenuContent>
      </MenuRoot>
    )
  }