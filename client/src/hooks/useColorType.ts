import { useColorModeValue } from "@chakra-ui/react";
import { IColorTypeProps } from "../types";

export const useColorType = () => {
  const initialColor = useColorModeValue("#D9D9D9", "#414141");
  const secondaryColor = useColorModeValue("#83B4FF", "#5F56E6");
  const primaryColor = useColorModeValue("#FFCF55", "#9A92FF");
  const contrastColor = useColorModeValue("#000000", "#FFFFFF");

  const getColorType = ({ isGameStarted, winner, moveCount, isPlayerTurn }: IColorTypeProps): string => {
    if (!isGameStarted || winner || moveCount === 9) {
      return initialColor;
    } else if (isPlayerTurn) {
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
