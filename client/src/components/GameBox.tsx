import React from "react";
import { IGameBoardProps } from "../types";
import { Flex } from "@chakra-ui/react";
import { useColorType } from "../hooks/useColorType";

export const GameBox: React.FC<IGameBoardProps> = ({ index, turn, value, combination, player, color }) => {
  const [_, getAllColors] = useColorType();
  const colors = getAllColors();

  return (
    <>
      {combination.length === 0 ? (
        <Flex
          alignItems="center"
          justifyContent="center"
          bg={color}
          w={["10vh", "13vh"]}
          h={["10vh", "13vh"]}
          onClick={() => turn(index)}
        >
          {value}
        </Flex>
      ) : (
        <>
          {combination.includes(index) ? (
            <Flex
              alignItems="center"
              justifyContent="center"
              w={["10vh", "13vh"]}
              h={["10vh", "13vh"]}
              bg={player === value ? colors[0] : colors[1]}
              onClick={() => turn(index)}
            >
              {value}
            </Flex>
          ) : (
            <Flex
              alignItems="center"
              justifyContent="center"
              bg={color}
              w={["10vh", "13vh"]}
              h={["10vh", "13vh"]}
              onClick={() => turn(index)}
            >
              {value}
            </Flex>
          )}
        </>
      )}
    </>
  );
};
