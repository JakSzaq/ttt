import { useColorModeValue } from "@chakra-ui/react";
import { ColorTypeProps } from "../types";

export const useColorType = () => {
  const initialColor = useColorModeValue("#D9D9D9", "#414141");
  const secondaryColor = useColorModeValue("#83B4FF", "#5F56E6");
  const primaryColor = useColorModeValue("#FFCF55", "#9A92FF");
  const contrastColor = useColorModeValue("#000000", "#FFFFFF");

  const getColorType = ({ hasOpponent, winner, moveCount, myTurn }: ColorTypeProps): string => {
    if (!hasOpponent || winner || moveCount === 9) {
      return initialColor;
    } else if (myTurn) {
      return primaryColor;
    } else {
      return secondaryColor;
    }
  };

  const getAllColors = (): string[] => {
    return new Array(primaryColor, secondaryColor, initialColor, contrastColor);
  };

  return [getColorType, getAllColors] as const;
};
