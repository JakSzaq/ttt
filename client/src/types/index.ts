export interface ISVGProps {
  color: string;
}

export interface ILogoProps extends ISVGProps {
  theme: string;
  width: number;
  height: number;
}

export interface IGameBoardProps {
  index: number;
  turn(index: number): void;
  value: string;
  combination: number[];
  player: string;
  color: string;
  boardSize: number[];
}

export interface ICodeBoxProps {
  room: string;
  isOnLeftSide: boolean | null;
  isFull: boolean;
}

export interface IToastProps {
  toast: any;
  toastId: string;
  toastTitle: string;
  toastStatus: "info" | "warning" | "success" | "error" | "loading" | undefined;
}

export interface IActionButtonProps {
  buttonType: string;
}

export interface IRoomDataProps {
  index: number;
  room: string;
  value: string;
  size: number;
}

export interface IColorTypeProps {
  isGameStarted: boolean;
  winner: boolean;
  moveCount: number;
  isPlayerTurn: boolean;
  isGameTied: boolean;
}

export enum Size {
  LARGE,
  MEDIUM,
  SMALL,
}

export interface SizesInterfaceI {
  size: Size;
  amount: number;
}

export interface ISizeButtonProps extends SizesInterfaceI {
  setChosenSize: React.Dispatch<React.SetStateAction<Size>>;
  chosenSize: Size;
  color: string;
}
