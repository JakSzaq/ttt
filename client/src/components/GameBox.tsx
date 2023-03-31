import React from "react";
import { GameBoardProps } from "../types";
import { Flex } from "@chakra-ui/react";
import { useColorType } from "../hooks/useColorType";

export const GameBox: React.FC<GameBoardProps> = ({ index, turn, value, combination, player, color }) => {
  const [_, getAllColors] = useColorType();
  const playerColor = getAllColors()[0];
  const opponentColor = getAllColors()[1];

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
          {combination[0] === index || combination[1] === index || combination[2] === index ? (
            <Flex
              alignItems="center"
              justifyContent="center"
              w={["10vh", "13vh"]}
              h={["10vh", "13vh"]}
              bg={player === value ? playerColor : opponentColor}
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
