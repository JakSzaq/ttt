import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, NavigateFunction } from 'react-router-dom';
import Logo from '../assets/Logo';
import { GameBox as Box } from '../components/GameBox';
import { RoomCodeBox as CodeBox } from '../components/RoomCodeBox';
import { Container, Stack, AspectRatio, useColorModeValue, VStack, useMediaQuery, useToast, Text, HStack, Button } from '@chakra-ui/react';
import { combinations } from '../data/Combinations';
import { showToast } from '../utils/ShowToast';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionButton } from '../components/ActionButton';
import { RoomDataProps } from '../interfaces';

import io from 'socket.io-client';
const socket = io(process.env.REACT_APP_WS_SERVER || "http://localhost:80" )

const GameScreen: React.FC = () => {
  const [game, setGame] = useState<string[]>(Array(9).fill(''));
  const [turnNumber, setTurnNumber] = useState<number>(0);
  const [myTurn, setMyTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<boolean>(false);
  const [xo, setXO] = useState<string>('X');
  const [player, setPlayer] = useState<string>('');
  const [hasOpponent, setHasOpponent] = useState<boolean>(false);
  const [winningCombination, setWinningCombination] = useState<number[]>([]);
  const [room, setRoom] = useState<string>("");
  const [turnSwitch, setTurnSwitch] = useState<boolean>(false);
  const [turnData, setTurnData] = useState<RoomDataProps>({ index: 0, room: '', value: '' });

  const location = useLocation();
  const roomCode: string = location.search.substring(1);
  const navigate: NavigateFunction = useNavigate();

  const primaryColor = useColorModeValue('#FFCF55', '#9A92FF');
  const initialBoardColor = useColorModeValue('#D9D9D9', '#414141');
  const secondPlayerColor = useColorModeValue('#83B4FF', '#5F56E6');
  const [isMobileSize]: boolean[] = useMediaQuery('(min-width: 992px)');
  const toast = useToast();

  const sendTurn = (index: number) => {
    if (!game[index] && !winner && myTurn && hasOpponent) {
      socket.emit('reqTurn', { index: index, value: xo, room: room });
    }
  };
  
  const sendRestart: VoidFunction = () => {
    socket.emit('reqRestart', room);
  };
  
  const restart: VoidFunction = () => {
    setGame(Array(9).fill(''));
    setWinner(false);
    setTurnNumber(0);
    setWinningCombination([]);
  };

  const playerTurnChanged = (roomData: RoomDataProps) => {
    const data = roomData;
    const currGame: string[] = [...game];
    if (!currGame[data.index] && !winner) {
      currGame[data.index] = data.value;
      setGame(currGame);
      setTurnNumber(turnNumber + 1);
      setTurnSwitch(false);
      setMyTurn(!myTurn);
      setPlayer(data.value);
    }
  }
  
  useEffect(() => {
    socket.on('playerTurn', (roomData: RoomDataProps) => {
      setTurnData(roomData);
      setTurnSwitch(true);
    });
  
    socket.on('restartRoom', () => {
      restart();
    });

    socket.on('opponent_joined_alert', () => {
      showToast({ 
        toast: toast,
        toastId: 'opponentJoinedToast', 
        toastTitle: 'Opponent has joined!', 
        toastStatus: 'success'
      });
    });

    socket.on('opponent_joined', () => {
      setHasOpponent(true);
    });

    socket.on('error_room_is_full', () => {
      navigate("/");
      showToast({ 
        toast: toast,
        toastId: 'roomFullToast', 
        toastTitle: 'The room you are trying to join is full!', 
        toastStatus: 'info' 
      });
    });

    socket.on('error_invalid_room_code', () => {
      navigate("/");
      showToast({ 
        toast: toast,
        toastId: 'roomCodeInvalidToast', 
        toastTitle: 'Invalid room code!', 
        toastStatus: 'error' 
      });
    });

    socket.on("gameStatus", () => {
      if (roomCode.length > 8){
         socket.emit('updateRoom', roomCode.substring(5));
      } else {
         socket.emit('updateRoom', roomCode);
      }
    });

    socket.on('pauseGame', () => {
        setXO('X');
        setMyTurn(true);
        setHasOpponent(false);
        setGame(Array(9).fill(''));
        setWinner(false);
        setTurnNumber(0);
        setWinningCombination([]);
        showToast({ 
          toast: toast,
          toastId: 'opponentLeftToast', 
          toastTitle: 'Your opponent has left!', 
          toastStatus: 'warning' 
        });
    });
    return () => {
      socket.off();
    }
  }, []);
  
  useEffect(() => {
    combinations.map((combination: number[]) => {
      if (game[combination[0]] === game[combination[1]] && game[combination[0]] === game[combination[2]] && game[combination[0]] !== '') {
        setWinningCombination(combination);
        setWinner(true);
      }
    })
    turnNumber === 0 && setMyTurn(myTurn ? true : false);
  }, [game, turnNumber, xo]);

  useEffect(() => {
    if (turnSwitch) {
      playerTurnChanged(turnData);
    }
  }, [turnSwitch]);

  useEffect(() => {
      const roomName: string = roomCode.substring(5);
      if (roomName.length === 8) {
        socket.emit('createRoom', roomName);
        setRoom(roomName);
        setMyTurn(true);
      }
      else {
        setXO('O');
        socket.emit('joinRoom', roomCode);
        setRoom(roomCode);
        setMyTurn(false);
      } 
      return () => {
        socket.emit('manualDisconnect');
      }
  }, []);

  return (
    <Container maxW='full' h='full' p={0} >
      <AnimatePresence>
        <VStack key='room' h='full' w='full'>
          <Stack h='auto' w={{ base: 'full', lg: '75%' }} direction={{ base: 'column', lg: 'row' }} justifyContent={{ base: 'center', lg: 'space-between' }} alignItems={{ base: 'center', lg: 'flex-start' }}>
            {isMobileSize && <CodeBox room={room} isOnLeftSide={true} isFull={hasOpponent}/>}
            <AspectRatio maxW='100px' w={100} ratio={1} mb={{ base: '10px', lg: '0' }}>
              <Logo color={primaryColor} theme={primaryColor === '#9A92FF' ? "#5F56E6" : "#83B4FF"} width={100} height={100} />
            </AspectRatio>
            <CodeBox room={room} isOnLeftSide={isMobileSize ? false : null} isFull={hasOpponent}/>
          </Stack>
          <VStack h='12vh' justifyContent='center'>
            <Text h="auto" fontWeight="bold" as={motion.p} transition={'.5s'} fontSize={hasOpponent && !winner && turnNumber !== 9 ? ['xl','4xl'] : ['4vh','4xl','6xl']}>
              {hasOpponent 
                ? ((winner || turnNumber === 9) 
                  ? (winner 
                    ? (player === xo 
                      ? "You've won!" 
                      : "You've lost!")   
                    : "You've tied!") 
                  : (myTurn 
                    ? "It's your turn" 
                    : "It's the opponent's turn"))
                : "Waiting for opponent..."
              }
            </Text>
          </VStack>
          <VStack fontFamily="Outfit" as={motion.div} transition={'.5s'} spacing={[1.5,3]} fontSize={['8vh','12vh']}  transformOrigin={"50% 0"} style={{ transform: !hasOpponent || winner || turnNumber === 9 ? 'scale(1)' : (myTurn ? 'scale(1.25)' : 'scale(1)')}}>
            <HStack spacing={[1.5,3]}>
              <Box index={0} turn={sendTurn} value={game[0]} combination={winningCombination} player={xo} type={!hasOpponent || winner || turnNumber === 9 ? initialBoardColor : (myTurn ? primaryColor : secondPlayerColor)}/>
              <Box index={1} turn={sendTurn} value={game[1]} combination={winningCombination} player={xo} type={!hasOpponent || winner || turnNumber === 9 ? initialBoardColor : (myTurn ? primaryColor : secondPlayerColor)}/>
              <Box index={2} turn={sendTurn} value={game[2]} combination={winningCombination} player={xo} type={!hasOpponent || winner || turnNumber === 9 ? initialBoardColor : (myTurn ? primaryColor : secondPlayerColor)}/>
            </HStack>
            <HStack spacing={[1.5,3]}>
              <Box index={3} turn={sendTurn} value={game[3]} combination={winningCombination} player={xo} type={!hasOpponent || winner || turnNumber === 9 ? initialBoardColor : (myTurn ? primaryColor : secondPlayerColor)}/>
              <Box index={4} turn={sendTurn} value={game[4]} combination={winningCombination} player={xo} type={!hasOpponent || winner || turnNumber === 9 ? initialBoardColor : (myTurn ? primaryColor : secondPlayerColor)}/>
              <Box index={5} turn={sendTurn} value={game[5]} combination={winningCombination} player={xo} type={!hasOpponent || winner || turnNumber === 9 ? initialBoardColor : (myTurn ? primaryColor : secondPlayerColor)}/>
            </HStack>
            <HStack spacing={[1.5,3]}>
              <Box index={6} turn={sendTurn} value={game[6]} combination={winningCombination} player={xo} type={!hasOpponent || winner || turnNumber === 9 ? initialBoardColor : (myTurn ? primaryColor : secondPlayerColor)}/>
              <Box index={7} turn={sendTurn} value={game[7]} combination={winningCombination} player={xo} type={!hasOpponent || winner || turnNumber === 9 ? initialBoardColor : (myTurn ? primaryColor : secondPlayerColor)}/>
              <Box index={8} turn={sendTurn} value={game[8]} combination={winningCombination} player={xo} type={!hasOpponent || winner || turnNumber === 9 ? initialBoardColor : (myTurn ? primaryColor : secondPlayerColor)}/>
            </HStack>
          </VStack>
          {(winner || turnNumber === 9) && (
            <Button margin={['20px !important','40px !important']} as={motion.button} transition={'.5s'} initial={{transform: 'scale(0)'}} animate={{transform: 'scale(1)'}} w={[200,250]} borderRadius='50px' bg='#FF6C6C' onClick={sendRestart}>Play again</Button>
          )}
        </VStack>
        <ActionButton type='exitControl' />
      </AnimatePresence>
    </Container>
  )
}

export default GameScreen