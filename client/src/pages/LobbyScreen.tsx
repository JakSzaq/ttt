import React, { useState } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { AspectRatio, Box, Container, Button, Text, VStack, HStack, Input, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import Logo from '../assets/Logo';
import BackgroundSVG from '../assets/BackgroundSVG';
import Footer from '../components/Footer';

import io from 'socket.io-client';
const socket = io(process.env.REACT_APP_WS_SERVER || "http://localhost:80" )

const LobbyScreen: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const [roomCode, setRoomCode] = useState<string>("");

  const { colorMode, toggleColorMode } = useColorMode();
  const primaryColor = useColorModeValue('#FFCF55', '#9A92FF')

  const handleCreate: React.MouseEventHandler<HTMLButtonElement> = () => {
    const newRoomName: string = random();
    socket.emit('addNewRoom', newRoomName);
    navigate({
        pathname: '/room',
        search: `?host=${newRoomName}`
    });
  }

  const handleJoin: React.MouseEventHandler<HTMLButtonElement> = () => {
    roomCode && navigate({
      pathname: '/room',
      search: `?${roomCode}`,
    });
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
     setRoomCode(e.target.value);
  }
  
  return (
    <Container maxW='full' h='full' p={0}>
      <VStack h='full' w='full'>
        <VStack h='500px'>
          <AspectRatio maxW='100px' w={100} ratio={1}>
            <Logo color={primaryColor} theme="lobby" width={100} height={100} />
          </AspectRatio>
          <Text fontWeight='bold' fontSize='6xl'>Join a game</Text>
          <HStack>
            <Input w={200}  textAlign='center' maxLength={8} placeholder='Enter room code'></Input>
            <Button bg={primaryColor}>JOIN</Button>
          </HStack>
          <Button w={75} h={75} borderRadius={50} size='lg' position='absolute' top={4} right={6} onClick={toggleColorMode}>
            {colorMode === 'light' ? <SunIcon w={10} h={10}/> : <MoonIcon w={10} h={10}/>}
          </Button>
        </VStack>
        <VStack position='relative' h='full' w='full' justifyContent='center' alignItems='center'>
          <BackgroundSVG color={primaryColor}/>
          <Text position='relative' fontWeight='bold' fontSize='6xl'>Create new room</Text>
          <Button w={250} borderRadius='50px' bg='#FF6C6C'>Click to start</Button>
        </VStack>
        <Footer />
      </VStack>
    </Container>
  )
}

const random: Function = () => {
    return Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('');
};

export default LobbyScreen