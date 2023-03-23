import React from 'react'
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { VStack, AspectRatio, Button, Text, useColorModeValue } from '@chakra-ui/react'
import Logo from '../assets/Logo';

const NotFoundScreen: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const logoColor = useColorModeValue('#000000','#FFFFFF');
  return (
    <VStack maxW='full' h='500px' p={0} spacing={5}>
      <AspectRatio maxW='100px' w={100} ratio={1}>
        <Logo color={logoColor} theme="error" width={100} height={100} />
      </AspectRatio>
      <Text mt="0.5rem !important" fontWeight='bold' fontSize={['4xl','6xl']}>Whoops! This page does not exist!</Text>
      <Button size="lg" onClick={() => navigate("/")}>Go to main page</Button>
    </VStack>
  )
}

export default NotFoundScreen