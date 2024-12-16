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

export const CompanySort = () => {
  const [value, setValue] = useState("relevance")

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
          <MenuRadioItem value="relevance">Most Relevant</MenuRadioItem>
          <MenuRadioItem value="name-asc">Name A-Z</MenuRadioItem>
          <MenuRadioItem value="name-desc">Name Z-A</MenuRadioItem>
          <MenuRadioItem value="rating">Highest Rated</MenuRadioItem>
        </MenuRadioItemGroup>
      </MenuContent>
    </MenuRoot>
  )
}
