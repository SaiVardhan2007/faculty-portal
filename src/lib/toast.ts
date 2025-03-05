
import { toast as sonnerToast } from "sonner";

// Re-export toast functions from sonner for consistent usage across the app
export const toast = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  info: (message: string) => sonnerToast.info(message),
  warning: (message: string) => sonnerToast.warning(message)
};
