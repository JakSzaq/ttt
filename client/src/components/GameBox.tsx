import React from "react";
import { GameBoardProps } from "../interfaces";
import { Flex, useColorModeValue } from "@chakra-ui/react";

export const GameBox: React.FC<GameBoardProps> = ({ index, turn, value, combination, player, type }) => {

  const playerColor = useColorModeValue('#FFCF55', '#9A92FF');
  const opponentColor = useColorModeValue('#83B4FF', '#5F56E6');

  return (
    <>
      {combination.length === 0 ? (
        <Flex alignItems='center' justifyContent='center' bg={type} w={['10vh','13vh']} h={['10vh','13vh']} onClick={() => turn(index)}>
          {value}
        </Flex>
      ) : (
        <>
          {combination[0] === index || combination[1] === index || combination[2] === index ? (
            <Flex alignItems='center' justifyContent='center' w={['10vh','13vh']} h={['10vh','13vh']} bg={player === value ? playerColor : opponentColor} onClick={() => turn(index)}>
              {value}
            </Flex>
          ) : (
            <Flex alignItems='center' justifyContent='center' bg={type} w={['10vh','13vh']} h={['10vh','13vh']} onClick={() => turn(index)}>
              {value}
            </Flex>
          )}
        </>
      )}
    </>
  );
};