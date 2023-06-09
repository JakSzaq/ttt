import React, { memo } from "react";
import { Button, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon, CloseIcon } from "@chakra-ui/icons";
import { IActionButtonProps } from "../types";
import { NavigateFunction, useNavigate } from "react-router-dom";

export const ActionButton: React.FC<IActionButtonProps> = memo(({ buttonType }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate: NavigateFunction = useNavigate();

  const handleExitClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    navigate("/");
  };

  return (
    <>
      {buttonType === "themeSwitch" && (
        <Button
          w={[35, 75]}
          h={[35, 75]}
          borderRadius={50}
          size="sm"
          position="absolute"
          top={6}
          right={6}
          onClick={toggleColorMode}
        >
          {colorMode === "light" ? <MoonIcon w={[5, 10]} h={[5, 10]} /> : <SunIcon w={[5, 10]} h={[5, 10]} />}
        </Button>
      )}
      {buttonType === "exitControl" && (
        <Button
          w={[35, 75]}
          h={[35, 75]}
          borderRadius={50}
          size="sm"
          position="absolute"
          top={6}
          left={6}
          onClick={handleExitClick}
        >
          <CloseIcon w={[4, 8]} h={[4, 8]} />
        </Button>
      )}
    </>
  );
});
