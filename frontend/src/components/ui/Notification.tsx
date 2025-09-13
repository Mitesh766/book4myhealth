import { AlertCircle, CheckCircle, X } from "lucide-react";
import { useEffect } from "react";

export const Notification = ({ type, messages, onClose, isVisible }:{type:string,messages:string[], onClose():void,isVisible:boolean}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible || !messages) return null;

  const messageArray = Array.isArray(messages) ? messages : [messages];
  const isError = type === "error";
  return (
    <div
      className={`fixed top-6 right-6 z-50 transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`min-w-80 max-w-md rounded-2xl backdrop-blur-xl border shadow-2xl ${
          isError
            ? "bg-red-950/90 border-red-800/50 shadow-red-900/20"
            : "bg-green-950/90 border-green-800/50 shadow-green-900/20"
        }`}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`mt-0.5 ${
                isError ? "text-red-400" : "text-green-400"
              }`}
            >
              {isError ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            </div>
            <div className="flex-1">
              <h4
                className={`font-semibold mb-2 ${
                  isError ? "text-red-100" : "text-green-100"
                }`}
              >
                {isError ? "Error" : "Success"}
              </h4>
              <div
                className={`text-sm space-y-1 ${
                  isError ? "text-red-200" : "text-green-200"
                }`}
              >
                {messageArray.map((message, index) => (
                  <p key={index}>{message}</p>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className={`mt-0.5 p-1 rounded-lg hover:bg-white/10 transition-colors ${
                isError
                  ? "text-red-400 hover:text-red-300"
                  : "text-green-400 hover:text-green-300"
              }`}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};