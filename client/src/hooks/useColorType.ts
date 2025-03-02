import { useColorModeValue } from "@chakra-ui/react";
import { IColorTypeProps } from "../types";
import { useCallback, useMemo } from "react";

export const useColorType = () => {
  const initialColor = useColorModeValue("#D9D9D9", "#414141");
  const secondaryColor = useColorModeValue("#83B4FF", "#5F56E6");
  const primaryColor = useColorModeValue("#FFCF55", "#9A92FF");
  const contrastColor = useColorModeValue("#000000", "#FFFFFF");

  const getColorType = ({
    isGameStarted,
    winner,
    moveCount,
    isPlayerTurn,
    isGameTied,
  }: IColorTypeProps): string => {
    if (!isGameStarted || winner || isGameTied) {
      return initialColor;
    } else if (isPlayerTurn) {
      return primaryColor;
    } else {
      return secondaryColor;
    }
  };

  const getAllColors = useCallback((): string[] => {
    return new Array(primaryColor, secondaryColor, initialColor, contrastColor);
  }, [primaryColor]);

  return [getColorType, getAllColors] as const;
};
