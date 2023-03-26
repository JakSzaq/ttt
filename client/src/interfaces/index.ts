
export interface SVGProps {
    color: string
}

export interface LogoProps extends SVGProps {
    theme: string;
    width: number;
    height: number;
}

export interface GameBoardProps extends ButtonProps {
    index: number;
    turn(index: number): void;
    value: string;
    combination: number[];
    player: string;
}

export interface CodeBoxProps {
    room: string;
    isOnLeftSide: boolean | null;
    isFull: boolean;
}

export interface ToastProps {
    toast: any;
    toastId: string;
    toastTitle: string;
    toastStatus: "info" | "warning" | "success" | "error" | "loading" | undefined;
}

export interface ButtonProps {
    type: string;
}

export interface RoomDataProps {
    index: number;
    room: string;
    value: string;
}