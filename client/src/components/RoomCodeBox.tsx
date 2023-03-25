import { Text, VStack, HStack, Button, useClipboard, useColorModeValue, useToast } from "@chakra-ui/react";
import React from "react";
import { CodeBoxProps } from "../interfaces";
import { showToast } from "../utils/ShowToast";

export const RoomCodeBox: React.FC<CodeBoxProps> = ({ room, isOnLeftSide, isFull}) => {
  
  const link: string = (window.location.origin + window.location.pathname + "?" + room);
  const { onCopy, hasCopied } = useClipboard(link);
  const modeColor = useColorModeValue('#83B4FF','#5F56E6');
  const toast = useToast();
  
  const handleCopy = () => {
    onCopy();
    showToast({ 
      toast: toast,
      toastId: 'roomCodeCopied', 
      toastTitle: 'Room link has been copied to your clipboard!', 
      toastStatus: 'info'
    });
  }
  
  return (
    <VStack alignItems={isOnLeftSide ? 'flex-start' : (isOnLeftSide === null ? 'center' : 'flex-end')}>
        {isOnLeftSide ? (
            <HStack>
              <Text fontSize={['xl','2xl']} fontWeight='bold'>Room code </Text>
              {!isFull && <Button h={8} bg='transparent' border='2px solid' borderRadius="50px" borderColor={isOnLeftSide || isOnLeftSide === null ? "#FF8383" : modeColor} onClick={handleCopy}>Share</Button>}
            </HStack>
        ) : (isOnLeftSide === null ? (
            <HStack>
              <Text fontSize={['xl','2xl']} fontWeight='bold'>Room code </Text>
              {!isFull && <Button h={8} bg='transparent' border='2px solid' borderRadius="50px" borderColor={isOnLeftSide || isOnLeftSide === null ? "#FF8383" : modeColor} onClick={handleCopy}>Share</Button>}
            </HStack>
        ) : (
            <HStack>
              {!isFull && <Button h={8} bg='transparent' border='2px solid' borderRadius="50px" borderColor={isOnLeftSide || isOnLeftSide === null ? "#FF8383" : modeColor} onClick={handleCopy}>Share</Button>}
              <Text fontSize={['xl','2xl']} fontWeight='bold'>Room code </Text>
            </HStack>
        ))}
        <Text userSelect="text" lineHeight={[4,8]} fontSize={['3xl','5xl']} fontWeight='bold' color={isOnLeftSide || isOnLeftSide === null ? "#FF8383" : modeColor}>{room}</Text>
    </VStack>
  );
};