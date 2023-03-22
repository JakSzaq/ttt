import { Box, Text } from '@chakra-ui/react'
import React from 'react'

const Footer: React.FC = () => {
  return (
    <Box h={10} position='fixed' bottom={0}>
        <Text letterSpacing={30} mr={-30} fontWeight='bold' userSelect='none'>JAKSZA</Text>
    </Box>
  )
}

export default Footer