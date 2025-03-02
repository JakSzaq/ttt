import React, { memo } from "react";
import { Flex, Text, Stack, Box, useColorMode } from "@chakra-ui/react";
import { ISizeButtonProps } from "../types";
import { NavigateFunction, redirect, useNavigate } from "react-router-dom";

export const SizeButton: React.FC<ISizeButtonProps> = memo(
  ({ size, amount, setChosenSize, chosenSize, color }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate: NavigateFunction = useNavigate();
    const bgColor = colorMode === "light" ? "#D9D9D9" : "white";

    return (
      <>
        <Flex
          direction="column"
          w={["11vh", "15vh"]}
          h={["7vh", "8vh"]}
          bg={amount > 0 ? bgColor : "lightgray"}
          fontWeight={"bold"}
          borderRadius={"10px"}
          transition={".25s"}
          border={
            size == chosenSize ? "4px solid " + color : "4px solid " + bgColor
          }
          justifyContent={"space-evenly"}
          cursor={"pointer"}
          _hover={{
            bg: amount > 0 ? color : "lightgray",
          }}
          onClick={() => amount > 0 && setChosenSize(size)}
        >
          <Text fontSize={["sm", "md", "lg"]} color="black">
            {size == 0 ? "LARGE" : size == 1 ? "MEDIUM" : "SMALL"}
          </Text>
          <Stack
            direction="row"
            justifyContent={"center"}
            mb={1}
            spacing={[1, 1.5]}
          >
            <Box
              borderRadius="50%"
              h={["3", "3.5", "4"]}
              w={["3", "3.5", "4"]}
              bg={amount > 0 ? "black" : "#b1b1b1"}
            />
            <Box
              borderRadius="50%"
              h={["3", "3.5", "4"]}
              w={["3", "3.5", "4"]}
              bg={amount > 1 ? "black" : "#b1b1b1"}
            />
            <Box
              borderRadius="50%"
              h={["3", "3.5", "4"]}
              w={["3", "3.5", "4"]}
              bg={amount > 2 ? "black" : "#b1b1b1"}
            />
          </Stack>
        </Flex>
      </>
    );
  }
);
