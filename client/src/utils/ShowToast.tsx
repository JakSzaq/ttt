import { IToastProps } from "../types";

export const showToast: Function = ({ toast, toastId, toastTitle, toastStatus }: IToastProps): void => {
  if (!toast.isActive(toastId)) {
    toast.closeAll();
    toast({
      id: toastId,
      title: toastTitle,
      position: "bottom",
      status: toastStatus,
      duration: 5000,
      isClosable: true,
      containerStyle: {
        mb: "10px",
      },
    });
  }
};
