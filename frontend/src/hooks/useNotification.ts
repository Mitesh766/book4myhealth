import { useState } from "react"

export const useNotification = () => {
     const [notification, setNotification] = useState<{type:string,messages:string[],isVisible:boolean}>({
    type: "error",
    messages: [],
    isVisible: false,
  });

    const showNotification = (type:string, messages:string[]) => {
    setNotification({ type, messages, isVisible: true });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

    return { notification, showNotification, hideNotification }
}