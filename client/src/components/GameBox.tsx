import React, { memo } from "react";
import { IGameBoardProps } from "../types";
import { Flex } from "@chakra-ui/react";
import { useColorType } from "../hooks/useColorType";

export const GameBox: React.FC<IGameBoardProps> = memo(
  ({ index, turn, value, combination, player, color, boardSize }) => {
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
            fontSize={
              boardSize[index] === 0
                ? ["8vh", "12vh"]
                : boardSize[index] === 1
                ? ["6vh", "9vh"]
                : ["4vh", "6vh"]
            }
            transition={".25s"}
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
                fontSize={
                  boardSize[index] === 0
                    ? ["8vh", "12vh"]
                    : boardSize[index] === 1
                    ? ["6vh", "9vh"]
                    : ["4vh", "6vh"]
                }
                transition={".25s"}
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
                fontSize={
                  boardSize[index] === 0
                    ? ["8vh", "12vh"]
                    : boardSize[index] === 1
                    ? ["6vh", "9vh"]
                    : ["4vh", "6vh"]
                }
                transition={".25s"}
              >
                {value}
              </Flex>
            )}
          </>
        )}
      </>
    );
  }
);
