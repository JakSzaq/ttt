import React from 'react'
import { Box, Text } from '@chakra-ui/react'

const Footer: React.FC = () => {
  return (
    <Box h={10} position='fixed' bottom={0}>
        <Text letterSpacing={30} mr={-30} fontWeight='bold'>JAKSZA</Text>
    </Box>
  )
}

export default Footer