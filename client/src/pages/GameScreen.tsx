import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, NavigateFunction } from "react-router-dom";
import Logo from "../assets/Logo";
import { GameBox as Box } from "../components/GameBox";
import { RoomCodeBox as CodeBox } from "../components/RoomCodeBox";
import {
  Container,
  Stack,
  AspectRatio,
  VStack,
  useMediaQuery,
  useToast,
  Text,
  HStack,
  Button,
  Flex,
  Center,
} from "@chakra-ui/react";
import { COMBINATIONS } from "../data/Combinations";
import { showToast } from "../utils/ShowToast";
import { AnimatePresence, motion } from "framer-motion";
import { ActionButton } from "../components/ActionButton";
import { IRoomDataProps, Size, SizesInterfaceI } from "../types";
import { useColorType } from "../hooks/useColorType";

import io from "socket.io-client";
import { SizeButton } from "../components/SizeButton";
const socket = io(process.env.REACT_APP_WS_SERVER || "http://localhost:80");

const GameScreen: React.FC = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [boardSize, setBoardSize] = useState<number[]>(Array(9).fill(3));
  const [moveCount, setMoveCount] = useState<number>(0);
  const [isPlayerTurn, setPlayerTurn] = useState<boolean>(false);
  const [isGameTied, setIsGameTied] = useState<boolean>(false);
  const [winner, setWinner] = useState<boolean>(false);
  const [scores, setScores] = useState<number[]>([0, 0]);
  const [symbol, setSymbol] = useState<"X" | "O">("O");
  const [chosenSize, setChosenSize] = useState<Size>(Size.LARGE);
  const [sizeAmounts, setSizeAmounts] = useState<number[]>([3, 3, 3]);
  const [player, setPlayer] = useState<string>("");
  const [isGameStarted, setGameStarted] = useState<boolean>(false);
  const [combination, setCombination] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [dotCount, setDotCount] = useState(0);
  const [room, setRoom] = useState<string>("");
  const [turnSwitch, setTurnSwitch] = useState<boolean>(false);
  const [turnData, setTurnData] = useState<IRoomDataProps>({
    index: 0,
    room: "",
    value: "",
    size: 0,
  });
  const [gameStatusTitle, setGameStatusTitle] = useState<string>("");

  const location = useLocation();
  const roomCode: string = location.search.substring(1);
  const navigate: NavigateFunction = useNavigate();

  const [isMobileSize]: boolean[] = useMediaQuery("(min-width: 992px)");
  const [getColorType, getAllColors] = useColorType();
  const colorType = getColorType({
    isGameStarted,
    winner,
    moveCount,
    isPlayerTurn,
    isGameTied,
  });
  const colors = getAllColors();
  const toast = useToast();

  const checkGameStatus = (board: string[]) => {
    COMBINATIONS.map((combination: number[]) => {
      if (
        combination.every((value) => board[value] === "X") ||
        combination.every((value) => board[value] === "O")
      ) {
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
        setScores((prevArray) =>
          prevArray.map((item, i) =>
            i === 0 && player === symbol
              ? item + 1
              : i == 1 && player !== symbol
              ? item + 1
              : item
          )
        );
        if (scores[0] - scores[1] >= 2 && scores[1] == 0 && player === symbol) {
          setGameStatusTitle("Is your name Thomas?");
        }
      } else if (isGameTied) {
        setGameStatusTitle("You've tied!");
      } else {
        setGameStatusTitle(
          isPlayerTurn ? "It's your turn" : "It's the opponents turn"
        );
      }
    } else {
      setIsPaused(true);
      setGameStatusTitle("Waiting for opponent" + ".".repeat(dotCount));
    }
  };

  const sendRestart = () => {
    socket.emit("restartGame", room);
  };

  const restart = () => {
    setBoard(Array(9).fill(""));
    setBoardSize(Array(9).fill(3));
    setSizeAmounts([3, 3, 3]);
    setWinner(false);
    setIsGameTied(false);
    setMoveCount(0);
    setCombination([]);
  };

  const playerTurnChanged = (roomData: IRoomDataProps) => {
    const data = roomData;
    const currentGame = [...board];
    if (
      (!currentGame[data.index] ||
        (currentGame[data.index] !== data.value &&
          data.size < boardSize[data.index])) &&
      !winner
    ) {
      currentGame[data.index] = data.value;
      setBoard(currentGame);
      setBoardSize((prevArray) =>
        prevArray.map((item, i) => (i === data.index ? data.size : item))
      );
      checkGameStatus(currentGame);
      setMoveCount(moveCount + 1);
      setTurnSwitch(false);
      setPlayerTurn(!isPlayerTurn);
      setPlayer(data.value);
    }
  };

  const sendTurn = (index: number) => {
    if (
      (!board[index] ||
        (board[index] !== symbol && chosenSize < boardSize[index])) &&
      !winner &&
      isPlayerTurn &&
      isGameStarted &&
      sizeAmounts[chosenSize] > 0
    ) {
      setSizeAmounts((prevArray) =>
        prevArray.map((item, i) => (i === chosenSize ? item - 1 : item))
      );
      socket.emit("nextMove", {
        index: index,
        value: symbol,
        room: room,
        size: chosenSize,
      });
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
      setIsPaused(false);
      setGameStarted(true);
      restart();
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
      setSymbol("O");
      setRoom(roomName);
      setPlayerTurn(true);
    });

    socket.on("setSecondPlayer", (roomName: string) => {
      setSymbol("X");
      setRoom(roomName);
      setPlayerTurn(false);
    });

    socket.on("opponentLeft", () => {
      setSymbol("O");
      setPlayerTurn(true);
      setGameStarted(false);
      setBoard(Array(9).fill(""));
      setScores([0, 0]);
      setWinner(false);
      setIsGameTied(false);
      setMoveCount(0);
      setCombination([]);
      showToast({
        toast: toast,
        toastId: "opponentLeftToast",
        toastTitle: "Your opponent has left!",
        toastStatus: "warning",
      });
    });

    const removeSocket = () => {
      socket.emit("manualDisconnect", roomCode);
      socket.off();
    };

    window.addEventListener("beforeunload", removeSocket);

    return () => {
      socket.emit("manualDisconnect", roomCode);
      socket.off();
      window.removeEventListener("beforeunload", removeSocket);
    };
  }, []);

  useEffect(() => {
    checkGameStatus(board);
    updateAppearance();
  }, [isGameStarted, board, winner, isGameTied]);

  useEffect(() => {
    turnSwitch && playerTurnChanged(turnData);
  }, [turnSwitch]);

  useEffect(() => {
    if (!isPaused) return;

    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    setGameStatusTitle("Waiting for opponent" + ".".repeat(dotCount));
  }, [dotCount]);

  useEffect(() => {
    const allNonEmpty = board.every((value) => value !== "");
    const isOutOfPieces = moveCount === 18;
    const hasValidMoves = board.some(
      (cell, i) =>
        (cell === null && sizeAmounts.some((amount) => amount > 0)) || // Empty cell and available pieces
        (boardSize[i] > 0 &&
          sizeAmounts.slice(0, boardSize[i]).some((amount) => amount > 0)) // Can be upgraded
    );
    if (isOutOfPieces || !hasValidMoves) {
      setIsGameTied(true);
    }
  }, [moveCount]);

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
            {isMobileSize && (
              <CodeBox room={room} isOnLeftSide={true} isFull={isGameStarted} />
            )}
            <Stack direction={{ base: "row", lg: "row" }}>
              {isGameStarted && (
                <Text
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  fontSize={["4xl", "6xl"]}
                  fontWeight={"black"}
                  px={[5, 5, 10]}
                  color={colors[0]}
                >
                  {scores[0]}
                </Text>
              )}
              <AspectRatio
                maxW={{ base: "50px", sm: "100px" }}
                w={100}
                ratio={1}
                mb={{ base: "10px", lg: "0" }}
              >
                <Logo
                  color={colors[0]}
                  theme={colors[1]}
                  width={100}
                  height={100}
                />
              </AspectRatio>
              {isGameStarted && (
                <Text
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  fontSize={["4xl", "6xl"]}
                  fontWeight={"black"}
                  px={[5, 5, 10]}
                  color={colors[1]}
                >
                  {scores[1]}
                </Text>
              )}
            </Stack>
            <CodeBox
              room={room}
              isOnLeftSide={isMobileSize ? false : null}
              isFull={isGameStarted}
            />
          </Stack>
          <VStack h="12vh" justifyContent="center">
            <Text
              h="auto"
              fontWeight="bold"
              as={motion.p}
              transition={".5s"}
              fontSize={
                isGameStarted && !winner && !isGameTied
                  ? ["3xl", "4xl"]
                  : ["4vh", "4xl", "6xl"]
              }
            >
              {gameStatusTitle}
            </Text>
            {isPlayerTurn && isGameStarted && !winner && !isGameTied && (
              <Text
                h={10}
                fontSize={["md", "xl"]}
                fontWeight={"bold"}
                style={{ margin: 0 }}
              >
                Select your size first
              </Text>
            )}
          </VStack>
          {isPlayerTurn && isGameStarted && !winner && !isGameTied && (
            <AnimatePresence>
              <VStack
                spacing={[1.5, 3]}
                as={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  type: "spring",
                  stiffness: 50,
                  damping: 15,
                  bounce: 0.75,
                  duration: 1.5,
                }}
                key={"options"}
              >
                <HStack spacing={[1.5, 3]}>
                  <SizeButton
                    size={Size.LARGE}
                    amount={sizeAmounts[0]}
                    setChosenSize={setChosenSize}
                    chosenSize={chosenSize}
                    color={colors[0]}
                  />
                  <SizeButton
                    size={Size.MEDIUM}
                    amount={sizeAmounts[1]}
                    setChosenSize={setChosenSize}
                    chosenSize={chosenSize}
                    color={colors[0]}
                  />
                  <SizeButton
                    size={Size.SMALL}
                    amount={sizeAmounts[2]}
                    setChosenSize={setChosenSize}
                    chosenSize={chosenSize}
                    color={colors[0]}
                  />
                </HStack>
              </VStack>
              <VStack h={3}>
                <Text h={1} w={["31vh", "42vh"]} bg={colors[1]} mt={1}></Text>
              </VStack>
            </AnimatePresence>
          )}
          <VStack
            fontFamily="Outfit"
            as={motion.div}
            transition={".5s"}
            spacing={[1.5, 3]}
            transformOrigin={"50% 0"}
            style={{
              transform:
                !isGameStarted || winner || isGameTied
                  ? "scale(1)"
                  : isPlayerTurn
                  ? "scale(1.25)"
                  : "scale(1)",
            }}
            key={"board"}
          >
            <HStack spacing={[1.5, 3]}>
              <Box
                index={0}
                turn={sendTurn}
                value={board[0]}
                combination={combination}
                player={symbol}
                color={colorType}
                boardSize={boardSize}
              />
              <Box
                index={1}
                turn={sendTurn}
                value={board[1]}
                combination={combination}
                player={symbol}
                color={colorType}
                boardSize={boardSize}
              />
              <Box
                index={2}
                turn={sendTurn}
                value={board[2]}
                combination={combination}
                player={symbol}
                color={colorType}
                boardSize={boardSize}
              />
            </HStack>
            <HStack spacing={[1.5, 3]}>
              <Box
                index={3}
                turn={sendTurn}
                value={board[3]}
                combination={combination}
                player={symbol}
                color={colorType}
                boardSize={boardSize}
              />
              <Box
                index={4}
                turn={sendTurn}
                value={board[4]}
                combination={combination}
                player={symbol}
                color={colorType}
                boardSize={boardSize}
              />
              <Box
                index={5}
                turn={sendTurn}
                value={board[5]}
                combination={combination}
                player={symbol}
                color={colorType}
                boardSize={boardSize}
              />
            </HStack>
            <HStack spacing={[1.5, 3]}>
              <Box
                index={6}
                turn={sendTurn}
                value={board[6]}
                combination={combination}
                player={symbol}
                color={colorType}
                boardSize={boardSize}
              />
              <Box
                index={7}
                turn={sendTurn}
                value={board[7]}
                combination={combination}
                player={symbol}
                color={colorType}
                boardSize={boardSize}
              />
              <Box
                index={8}
                turn={sendTurn}
                value={board[8]}
                combination={combination}
                player={symbol}
                color={colorType}
                boardSize={boardSize}
              />
            </HStack>
          </VStack>
          {(winner || isGameTied) && (
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
