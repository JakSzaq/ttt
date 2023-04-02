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
}

export interface IColorTypeProps {
  isGameStarted: boolean;
  winner: boolean;
  moveCount: number;
  isPlayerTurn: boolean;
}
