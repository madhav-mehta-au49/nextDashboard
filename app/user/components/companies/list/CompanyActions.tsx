   import { LuBookmark, LuFlag, LuMoreVertical, LuShare2 } from "react-icons/lu"
 import { Button } from "@/components/ui/button"
import { 
    MenuContent, 
    MenuItem, 
    MenuRoot,
    MenuSeparator,
    MenuTrigger,
    MenuTriggerItem
  } from "@/components/ui/menu"
  
  export const CompanyActions = () => {
    return (
      <MenuRoot>
        <MenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <LuMoreVertical />
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>
            <LuBookmark />
            Save Company
          </MenuItem>
          <MenuItem>
            <LuShare2 />
            Share
          </MenuItem>
          <MenuSeparator />
          <MenuTriggerItem>
            <LuFlag />
            Report Company
          </MenuTriggerItem>
        </MenuContent>
      </MenuRoot>
    )
  }
  