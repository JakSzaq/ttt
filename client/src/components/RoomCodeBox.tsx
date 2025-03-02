import {
  Text,
  VStack,
  HStack,
  Button,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { ICodeBoxProps } from "../types";
import { showToast } from "../utils/ShowToast";
import { useColorType } from "../hooks/useColorType";

export const RoomCodeBox: React.FC<ICodeBoxProps> = memo(
  ({ room, isOnLeftSide, isFull }) => {
    const link: string =
      window.location.origin + window.location.pathname + "?" + room;
    const { onCopy: copyLink } = useClipboard(link);
    const { onCopy: copyCode } = useClipboard(room);
    const [_, getAllColors] = useColorType();
    const modeColor = getAllColors()[1];
    const toast = useToast();

    const handleCopyLink: React.MouseEventHandler<HTMLButtonElement> = () => {
      copyLink();
      showToast({
        toast: toast,
        toastId: "roomLinkCopied",
        toastTitle: "Room link has been copied to your clipboard!",
        toastStatus: "info",
      });
    };

    const handleCopyCode: React.MouseEventHandler<HTMLElement> = () => {
      copyCode();
      showToast({
        toast: toast,
        toastId: "roomCodeCopied",
        toastTitle: "Room code has been copied to your clipboard!",
        toastStatus: "info",
      });
    };

    return (
      <VStack
        alignItems={
          isOnLeftSide
            ? "flex-start"
            : isOnLeftSide === null
            ? "center"
            : "flex-end"
        }
      >
        {isOnLeftSide ? (
          <HStack>
            <Text fontSize={["xl", "2xl"]} fontWeight="bold">
              Room code{" "}
            </Text>
            {!isFull && (
              <Button
                h={8}
                bg="transparent"
                border="2px solid"
                borderRadius="50px"
                borderColor={
                  isOnLeftSide || isOnLeftSide === null ? "#FF8383" : modeColor
                }
                onClick={handleCopyLink}
              >
                Share
              </Button>
            )}
          </HStack>
        ) : isOnLeftSide === null ? (
          <HStack>
            <Text fontSize={["xl", "2xl"]} fontWeight="bold">
              Room code{" "}
            </Text>
            {!isFull && (
              <Button
                h={8}
                bg="transparent"
                border="2px solid"
                borderRadius="50px"
                borderColor={
                  isOnLeftSide || isOnLeftSide === null ? "#FF8383" : modeColor
                }
                onClick={handleCopyLink}
              >
                Share
              </Button>
            )}
          </HStack>
        ) : (
          <HStack>
            {!isFull && (
              <Button
                h={8}
                bg="transparent"
                border="2px solid"
                borderRadius="50px"
                borderColor={
                  isOnLeftSide || isOnLeftSide === null ? "#FF8383" : modeColor
                }
                onClick={handleCopyLink}
              >
                Share
              </Button>
            )}
            <Text fontSize={["xl", "2xl"]} fontWeight="bold">
              Room code{" "}
            </Text>
          </HStack>
        )}
        <Text
          lineHeight={[4, 8]}
          fontSize={["3xl", "5xl"]}
          fontWeight="bold"
          color={isOnLeftSide || isOnLeftSide === null ? "#FF8383" : modeColor}
          onClick={handleCopyCode}
          cursor={"pointer"}
          transition={".25s"}
          _hover={{
            opacity: ".75",
          }}
        >
          {room}
        </Text>
      </VStack>
    );
  }
);
