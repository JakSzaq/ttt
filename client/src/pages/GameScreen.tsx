import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, NavigateFunction } from "react-router-dom";
import Logo from "../assets/Logo";
import { GameBox as Box } from "../components/GameBox";
import { RoomCodeBox as CodeBox } from "../components/RoomCodeBox";
import { Container, Stack, AspectRatio, VStack, useMediaQuery, useToast, Text, HStack, Button } from "@chakra-ui/react";
import { COMBINATIONS } from "../data/Combinations";
import { showToast } from "../utils/ShowToast";
import { AnimatePresence, motion } from "framer-motion";
import { ActionButton } from "../components/ActionButton";
import { IRoomDataProps } from "../types";
import { useColorType } from "../hooks/useColorType";

import io from "socket.io-client";
const socket = io(process.env.REACT_APP_WS_SERVER || "http://localhost:80");

const GameScreen: React.FC = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [moveCount, setMoveCount] = useState<number>(0);
  const [isPlayerTurn, setPlayerTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<boolean>(false);
  const [symbol, setSymbol] = useState<"X" | "O">("X");
  const [player, setPlayer] = useState<string>("");
  const [isGameStarted, setGameStarted] = useState<boolean>(false);
  const [combination, setCombination] = useState<number[]>([]);
  const [room, setRoom] = useState<string>("");
  const [turnSwitch, setTurnSwitch] = useState<boolean>(false);
  const [turnData, setTurnData] = useState<IRoomDataProps>({
    index: 0,
    room: "",
    value: "",
  });
  const [gameStatusTitle, setGameStatusTitle] = useState<string>("");

  const location = useLocation();
  const roomCode: string = location.search.substring(1);
  const navigate: NavigateFunction = useNavigate();

  const [isMobileSize]: boolean[] = useMediaQuery("(min-width: 992px)");
  const [getColorType, getAllColors] = useColorType();
  const colorType = getColorType({ isGameStarted, winner, moveCount, isPlayerTurn });
  const colors = getAllColors();
  const toast = useToast();

  const checkGameStatus = (board: string[]) => {
    COMBINATIONS.map((combination: number[]) => {
      if (combination.every((value) => board[value] === "X") || combination.every((value) => board[value] === "O")) {
        setCombination(combination);
        setWinner(true);
      }
    });
    moveCount === 0 && setPlayerTurn(isPlayerTurn);
  };

  const updateAppearance = () => {
    if (isGameStarted) {
      if (winner) {
        setGameStatusTitle(player === symbol ? "You've won!" : "You've lost!");
      } else if (moveCount === 9) {
        setGameStatusTitle("You've tied!");
      } else {
        setGameStatusTitle(isPlayerTurn ? "It's your turn" : "It's the opponents turn");
      }
    } else {
      setGameStatusTitle("Waiting for opponent...");
    }
  };

  const sendTurn = (index: number) => {
    if (!board[index] && !winner && isPlayerTurn && isGameStarted) {
      socket.emit("nextMove", { index: index, value: symbol, room: room });
    }
  };

  const sendRestart = () => {
    socket.emit("restartGame", room);
  };

  const restart = () => {
    setBoard(Array(9).fill(""));
    setWinner(false);
    setMoveCount(0);
    setCombination([]);
  };

  const playerTurnChanged = (roomData: IRoomDataProps) => {
    const data = roomData;
    const currentGame = [...board];
    if (!currentGame[data.index] && !winner) {
      currentGame[data.index] = data.value;
      setBoard(currentGame);
      checkGameStatus(currentGame);
      setMoveCount(moveCount + 1);
      setTurnSwitch(false);
      setPlayerTurn(!isPlayerTurn);
      setPlayer(data.value);
    }
  };

  useEffect(() => {
    const roomName: string = roomCode;
    socket.emit("joinRoom", roomName);

    socket.on("playerMove", (roomData: IRoomDataProps) => {
      setTurnData(roomData);
      setTurnSwitch(true);
    });

    socket.on("restartRoom", () => {
      restart();
    });

    socket.on("opponentJoinedAlert", () => {
      showToast({
        toast: toast,
        toastId: "opponentJoinedToast",
        toastTitle: "Opponent has joined!",
        toastStatus: "success",
      });
    });

    socket.on("opponentJoined", () => {
      setGameStarted(true);
    });

    socket.on("errorRoomIsFull", () => {
      navigate("/");
      showToast({
        toast: toast,
        toastId: "roomFullToast",
        toastTitle: "The room you are trying to join is full!",
        toastStatus: "info",
      });
    });

    socket.on("errorInvalidRoomCode", () => {
      navigate("/");
      showToast({
        toast: toast,
        toastId: "roomCodeInvalidToast",
        toastTitle: "Invalid room code!",
        toastStatus: "error",
      });
    });

    socket.on("gameStatusChanged", () => {
      socket.emit("updateRoom", roomCode);
    });

    socket.on("setFirstPlayer", (roomName: string) => {
      setSymbol("X");
      setRoom(roomName);
      setPlayerTurn(true);
    });

    socket.on("setSecondPlayer", (roomName: string) => {
      setSymbol("O");
      setRoom(roomName);
      setPlayerTurn(false);
    });

    socket.on("opponentLeft", () => {
      setSymbol("X");
      setPlayerTurn(true);
      setGameStarted(false);
      setBoard(Array(9).fill(""));
      setWinner(false);
      setMoveCount(0);
      setCombination([]);
      showToast({
        toast: toast,
        toastId: "opponentLeftToast",
        toastTitle: "Your opponent has left!",
        toastStatus: "warning",
      });
    });
    return () => {
      socket.emit("manualDisconnect");
      socket.off();
    };
  }, []);

  useEffect(() => {
    checkGameStatus(board);
    updateAppearance();
  }, [isGameStarted, board, winner]);

  useEffect(() => {
    turnSwitch && playerTurnChanged(turnData);
  }, [turnSwitch]);

  return (
    <Container maxW="full" h="full" p={0}>
      <AnimatePresence>
        <VStack key="room" h="full" w="full">
          <Stack
            h="auto"
            w={{ base: "full", lg: "75%" }}
            direction={{ base: "column", lg: "row" }}
            justifyContent={{ base: "center", lg: "space-between" }}
            alignItems={{ base: "center", lg: "flex-start" }}
          >
            {isMobileSize && <CodeBox room={room} isOnLeftSide={true} isFull={isGameStarted} />}
            <AspectRatio maxW={{ base: "50px", sm: "100px" }} w={100} ratio={1} mb={{ base: "10px", lg: "0" }}>
              <Logo color={colors[0]} theme={colors[1]} width={100} height={100} />
            </AspectRatio>
            <CodeBox room={room} isOnLeftSide={isMobileSize ? false : null} isFull={isGameStarted} />
          </Stack>
          <VStack h="12vh" justifyContent="center">
            <Text
              h="auto"
              fontWeight="bold"
              as={motion.p}
              transition={".5s"}
              fontSize={isGameStarted && !winner && moveCount !== 9 ? ["xl", "4xl"] : ["4vh", "4xl", "6xl"]}
            >
              {gameStatusTitle}
            </Text>
          </VStack>
          <VStack
            fontFamily="Outfit"
            as={motion.div}
            transition={".5s"}
            spacing={[1.5, 3]}
            fontSize={["8vh", "12vh"]}
            transformOrigin={"50% 0"}
            style={{
              transform: !isGameStarted || winner || moveCount === 9 ? "scale(1)" : isPlayerTurn ? "scale(1.25)" : "scale(1)",
            }}
          >
            <HStack spacing={[1.5, 3]}>
              <Box index={0} turn={sendTurn} value={board[0]} combination={combination} player={symbol} color={colorType} />
              <Box index={1} turn={sendTurn} value={board[1]} combination={combination} player={symbol} color={colorType} />
              <Box index={2} turn={sendTurn} value={board[2]} combination={combination} player={symbol} color={colorType} />
            </HStack>
            <HStack spacing={[1.5, 3]}>
              <Box index={3} turn={sendTurn} value={board[3]} combination={combination} player={symbol} color={colorType} />
              <Box index={4} turn={sendTurn} value={board[4]} combination={combination} player={symbol} color={colorType} />
              <Box index={5} turn={sendTurn} value={board[5]} combination={combination} player={symbol} color={colorType} />
            </HStack>
            <HStack spacing={[1.5, 3]}>
              <Box index={6} turn={sendTurn} value={board[6]} combination={combination} player={symbol} color={colorType} />
              <Box index={7} turn={sendTurn} value={board[7]} combination={combination} player={symbol} color={colorType} />
              <Box index={8} turn={sendTurn} value={board[8]} combination={combination} player={symbol} color={colorType} />
            </HStack>
          </VStack>
          {(winner || moveCount === 9) && (
            <Button
              margin={["20px !important", "40px !important"]}
              as={motion.button}
              transition={".5s"}
              initial={{ transform: "scale(0)" }}
              animate={{ transform: "scale(1)" }}
              w={[200, 250]}
              borderRadius="50px"
              bg="#FF6C6C"
              onClick={sendRestart}
            >
              Play again
            </Button>
          )}
        </VStack>
        <ActionButton buttonType="exitControl" />
      </AnimatePresence>
    </Container>
  );
};

export default GameScreen;
