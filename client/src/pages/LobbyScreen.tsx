import React, { useEffect, useState, useRef } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import {
  AspectRatio,
  Container,
  Button,
  Text,
  VStack,
  Stack,
  Input,
  useToast,
} from "@chakra-ui/react";
import { random } from "../utils/Random";
import { showToast } from "../utils/ShowToast";
import Logo from "../assets/Logo";
import BackgroundSVG from "../assets/BackgroundSVG";
import { useColorType } from "../hooks/useColorType";

import io from "socket.io-client";
const socket = io(import.meta.env.VITE_WS_SERVER, {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  transports: ["websocket"],
});

const LobbyScreen: React.FC = () => {
  const [roomCode, setRoomCode] = useState<string>("");
  const navigate: NavigateFunction = useNavigate();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [_, getAllColors] = useColorType();
  const primaryColor = getAllColors()[0];

  function joinRoom(roomCode: string) {
    roomCode &&
      navigate({
        pathname: "/room",
        search: `?${roomCode}`,
      });
  }

  useEffect(() => {
    socket.on("roomResponse", (response: string) => {
      if (response === "roomIsNonexistent") {
        if (inputRef.current) inputRef.current.focus();
        showToast({
          toast: toast,
          toastId: "roomCodeInvalidToast",
          toastTitle: "Invalid room code!",
          toastStatus: "error",
        });
      } else if (response === "roomIsFull") {
        if (inputRef.current) inputRef.current.focus();
        showToast({
          toast: toast,
          toastId: "roomFullToast",
          toastTitle: "The room you are trying to join is full!",
          toastStatus: "info",
        });
      } else {
        joinRoom(response);
      }
    });
    return () => {
      socket.off("roomResponse");
    };
  }, []);

  const handleCreate: React.MouseEventHandler<HTMLButtonElement> = () => {
    const newRoomName: string = random();
    socket.emit("addNewRoom", newRoomName);
    joinRoom(newRoomName);
  };

  const handleJoin: React.MouseEventHandler<HTMLButtonElement> = () => {
    socket.emit("checkIfRoomExistsOrIsFull", roomCode);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setRoomCode(e.target.value);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      socket.emit("checkIfRoomExistsOrIsFull", roomCode);
    }
  };

  return (
    <Container maxW="full" h="full" p={0}>
      <VStack h="full" w="full">
        <VStack h="500px">
          <AspectRatio maxW="100px" w={100} ratio={1}>
            <Logo
              color={primaryColor}
              theme="#FF8383"
              width={100}
              height={100}
            />
          </AspectRatio>
          <Text fontWeight="bold" fontSize={["4xl", "6xl"]}>
            Join a game
          </Text>
          <Stack direction={{ base: "column", sm: "row" }}>
            <Input
              ref={inputRef}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              value={roomCode}
              w={200}
              textAlign="center"
              maxLength={8}
              placeholder="Enter room code"
            ></Input>
            <Button onClick={handleJoin} bg={primaryColor}>
              JOIN
            </Button>
          </Stack>
        </VStack>
        <VStack
          position="relative"
          h="full"
          w="full"
          justifyContent="center"
          alignItems="center"
        >
          <BackgroundSVG color={primaryColor} />
          <Text position="relative" fontWeight="bold" fontSize={["4xl", "6xl"]}>
            Create new room
          </Text>
          <Button
            onClick={handleCreate}
            w={[200, 250]}
            borderRadius="50px"
            bg="#FF6C6C"
          >
            Click to start
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
};

export default LobbyScreen;
