import { List } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

type SuggestionsListProps = {
    type: 'jobs' | 'candidates'
    onSelect?: (value: string) => void
}

export const SuggestionsList = ({ type, onSelect }: SuggestionsListProps) => {
    const router = useRouter()
    const suggestions = type === 'jobs' 
        ? ['Software Engineer', 'Product Manager']
        : ['Frontend Developer', 'Backend Engineer']

    const handleSuggestionClick = (suggestion: string) => {
        onSelect?.(suggestion)
        router.push(`/search/${type}?q=${encodeURIComponent(suggestion)}`)
    }

    return (
        <List.Root gap="2" variant="plain">
            {suggestions.map((suggestion) => (
                <List.Item 
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    cursor="pointer"
                    _hover={{ bg: 'gray.100' }}
                    p={2}
                    borderRadius="md"
                >

                    {suggestion}
                </List.Item>
            ))}
        </List.Root>
    )
}
