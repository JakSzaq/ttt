import React from 'react'
import { Box, Text } from '@chakra-ui/react'

export const Footer: React.FC = () => {
  return (
    <Box w='full' h={10} position='fixed' bottom={0}>
        <Text letterSpacing={30} mr={-27} fontWeight='bold'>JAKSZA</Text>
    </Box>
  )
}