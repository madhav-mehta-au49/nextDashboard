"use client"

import {
    Box,
    Container,
    Grid,
    GridItem,
    Input,
    Tabs
} from '@chakra-ui/react'
import { debounce } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { LuBriefcase, LuSearch, LuUser } from 'react-icons/lu'
import { Field } from '@/components/ui/field'
import { InputGroup } from "@/components/ui/input-group"
import { SuggestionsList } from './searchbar/suggestions'

type TabType = 'jobs' | 'candidates'

export const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [activeTab, setActiveTab] = useState<TabType>('jobs')
    const [isLoading, setIsLoading] = useState(false)
    const suggestionsRef = useRef<HTMLDivElement>(null)

    const debouncedSearch = debounce((value: string) => {
        setSearchQuery(value)
        setShowSuggestions(true)
    }, 300)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = async (type: TabType) => {
        setIsLoading(true)
        try {
            console.log(`Searching ${type} for: ${searchQuery}`)
            // Add your API call here
            setShowSuggestions(false)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container maxW="6xl" py={20}>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                <GridItem colSpan={4}>
                    <Tabs.Root defaultValue="jobs" variant="plain" onChange={(value) => setActiveTab(value as TabType)}>
                        <Tabs.List bg="white" display="flex" justifyContent="center" >
                            <Tabs.Trigger
                                value="jobs"
                                mx={4}
                                px={6}
                                py={2}
                                _selected={{ bg: '#bff8f2', borderRadius: 'md' }}
                            >
                                <Box display="flex" alignItems="center" gap={2}>
                                    <LuBriefcase />
                                    Job Search
                                </Box>
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                value="candidates"
                                mx={4}
                                px={6}
                                py={2}
                                _selected={{ bg: '#bff8f2', borderRadius: 'md' }}
                            >
                                <Box display="flex" alignItems="center" gap={2}>
                                    <LuUser />
                                    Candidate Search
                                </Box>
                            </Tabs.Trigger>
                            <Tabs.Indicator rounded="l2" />
                        </Tabs.List>
                        <Tabs.Content value="jobs">
                            <Box position="relative" mt={4}>
                                <Field rounded="l3" p="1" display="flex" justifyContent="center" shadow="sm" width="100%">
                                    <InputGroup
                                        startElement={<LuSearch />}
                                        startElementProps={{
                                            pointerEvents: "none",
                                            color: "gray.500",
                                        }}
                                        width="100%"
                                    >
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            colorScheme="green"
                                            placeholder="Search for Job..."
                                            value={searchQuery}
                                            onChange={(e) => debouncedSearch(e.target.value)}
                                            _hover={{ borderColor: 'gray.300' }}
                                            _focusVisible={{ borderColor: '#14B8A6', boxShadow: 'sm' }}
                                            
                                            bg="white"
                                            width="100%"

                                        />
                                    </InputGroup>
                                </Field>
                                {showSuggestions && searchQuery && (
                                    <Box
                                        ref={suggestionsRef}
                                        position="absolute"
                                        top="100%"
                                        left={0}
                                        right={0}
                                        bg="white"
                                        boxShadow="lg"
                                        borderRadius="md"
                                        mt={2}
                                        zIndex={10}
                                    >
                                        <SuggestionsList type="jobs" />
                                    </Box>
                                )}
                            </Box>
                        </Tabs.Content>

                        <Tabs.Content value="candidates">
                            <Box position="relative" mt={4}>
                                <Field rounded="l3" p="1" display="flex" justifyContent="center" shadow="sm" width="100%">
                                    <InputGroup
                                        startElement={<LuSearch />}
                                        startElementProps={{
                                            pointerEvents: "none",
                                            color: "gray.500",
                                        }}
                                        width="100%"
                                    >
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            colorScheme="gray"
                                            placeholder="Search for candidates..."
                                            value={searchQuery}
                                            onChange={(e) => debouncedSearch(e.target.value)}
                                            _hover={{ borderColor: 'gray.300' }}
                                            _focus={{ borderColor: '#14B8A6', boxShadow: 'sm' }}
                                            bg="white"
                                            width="100%"
                                        />
                                    </InputGroup>
                                </Field>

                                {showSuggestions && searchQuery && (
                                    <Box
                                        ref={suggestionsRef}
                                        position="absolute"
                                        top="100%"
                                        left={0}
                                        right={0}
                                        bg="white"
                                        boxShadow="lg"
                                        borderRadius="md"
                                        mt={2}
                                        zIndex={10}
                                    >
                                        <SuggestionsList
                                            type={activeTab}
                                            onSelect={(value) => {
                                                setSearchQuery(value)
                                                handleSearch(activeTab)
                                                setShowSuggestions(false)
                                            }}
                                        />
                                    </Box>
                                )}
</Box>
                        </Tabs.Content>
                    </Tabs.Root>
                </GridItem>
            </Grid>
        </Container>
    )
}

export default SearchBar
