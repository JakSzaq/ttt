import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { AspectRatio, Container, Button, Text, VStack, Stack, Input, useColorModeValue, useToast } from '@chakra-ui/react';
import { random } from '../utils/Random';
import { showToast } from '../utils/ShowToast';
import Logo from '../assets/Logo';
import BackgroundSVG from '../assets/BackgroundSVG';

import io from 'socket.io-client';
const socket = io(process.env.REACT_APP_WS_SERVER || "http://localhost:80" )

const LobbyScreen: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const [roomCode, setRoomCode] = useState<string>("");
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const primaryColor = useColorModeValue('#FFCF55', '#9A92FF');

  function joinRoom(roomCode: string) {
    roomCode && navigate({
      pathname: '/room',
      search: `?${roomCode}`,
    });
  }
  
  useEffect(() => {
    socket.on("canJoinRoom", (value: string) => {
      if (value) { joinRoom(value) }
      else {
        if (inputRef.current) inputRef.current.focus();
        showToast({ 
          toast: toast,
          toastId: 'roomCodeInvalidToast', 
          toastTitle: 'Invalid room code!', 
          toastStatus: 'error' 
        });
      }
    });
    return () => {
      socket.off("canJoinRoom");
    }
  }, [])

  const handleCreate: React.MouseEventHandler<HTMLButtonElement> = () => {
    const newRoomName: string = random();
    socket.emit('addNewRoom', newRoomName);
    navigate({
        pathname: '/room',
        search: `?host=${newRoomName}`
    });
  }

  const handleJoin: React.MouseEventHandler<HTMLButtonElement> = () => {
    socket.emit('getAllRooms', roomCode);
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
     setRoomCode(e.target.value);
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
     if (e.key === 'Enter') {
      socket.emit('getAllRooms', roomCode);
     }
  }
  
  return (
    <Container maxW='full' h='full' p={0}>
      <VStack h='full' w='full'>
        <VStack h='500px'>
          <AspectRatio maxW='100px' w={100} ratio={1}>
            <Logo color={primaryColor} theme="#FF8383" width={100} height={100} />
          </AspectRatio>
          <Text fontWeight='bold' fontSize={['4xl','6xl']}>Join a game</Text>
          <Stack direction={{ base: 'column', sm: 'row' }}>
            <Input ref={inputRef} onChange={handleChange} onKeyDown={handleKeyDown} value={roomCode} w={200} textAlign='center' maxLength={8} placeholder='Enter room code'></Input>
            <Button onClick={handleJoin} bg={primaryColor}>JOIN</Button>
          </Stack>
        </VStack>
        <VStack position='relative' h='full' w='full' justifyContent='center' alignItems='center'>
          <BackgroundSVG color={primaryColor}/>
          <Text position='relative' fontWeight='bold' fontSize={['4xl','6xl']}>Create new room</Text>
          <Button onClick={handleCreate} w={[200,250]} borderRadius='50px' bg='#FF6C6C'>Click to start</Button>
        </VStack>
      </VStack>
    </Container>
  )
}

export default LobbyScreen