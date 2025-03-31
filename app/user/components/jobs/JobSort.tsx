"use client"

import { SetStateAction, useState } from "react"
import { HiSortAscending } from "react-icons/hi"
import { Button } from "@/components/ui/button"
import {
  MenuContent,
  MenuRadioItem,
  MenuRadioItemGroup,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"

export const JobSort = () => {
  const [value, setValue] = useState("most-recent")

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="outline" size="sm">
          <HiSortAscending /> Sort
        </Button>
      </MenuTrigger>
      <MenuContent minW="10rem">
        <MenuRadioItemGroup
          value={value}
          onValueChange={(e: { value: SetStateAction<string> }) => setValue(e.value)}
        >
          <MenuRadioItem value="most-recent">Most Recent</MenuRadioItem>
          <MenuRadioItem value="most-relevant">Most Relevant</MenuRadioItem>
          <MenuRadioItem value="highest-salary">Highest Salary</MenuRadioItem>
        </MenuRadioItemGroup>
      </MenuContent>
    </MenuRoot>
  )
}