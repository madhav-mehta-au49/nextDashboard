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

export const CandidateSort = () => {
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
          <MenuRadioItem value="most-recent">Most Recent</MenuRadioItem>
          <MenuRadioItem value="highest-rated">Highest Rated</MenuRadioItem>
          <MenuRadioItem value="most-connections">Most Connections</MenuRadioItem>
        </MenuRadioItemGroup>
      </MenuContent>
    </MenuRoot>
  )
}