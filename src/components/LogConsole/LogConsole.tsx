import { ArrowDown } from "../../Icons/ArrowDown";
import { ArrowUp } from "../../Icons/ArrowUp";
import { ClearIcon } from "../../Icons/ClearIcon";
import { ErrorIcon } from "../../Icons/ErrorIcon";
import { InfoIcon } from "../../Icons/InfoIcon";
import { useLoggerStore } from "../../store/useLoggerStore";

export const LogConsole = () => {
  const messages = useLoggerStore((state) => state.messages);
  const clearMessages = useLoggerStore((state) => state.clear);
  return (
    <div
      className="mockup-code overflow-auto"
      style={{ height: "calc(100vh - 7rem)" }}
    >
      <div className="bg-neutral text-neutral-content p-2 rounded-md flex items-center gap-2 shadow-md">
        <ClearIcon onClick={clearMessages} />
      </div>
      {messages.map((line, idx) => (
        <pre key={idx} className="flex items-start">
          <span className="flex-shrink-0 w-6 flex justify-center items-center">
            {line.type === "outgoing" && <ArrowUp />}
            {line.type === "incoming" && <ArrowDown />}
            {line.type === "info" && <InfoIcon />}
            {line.type === "error" && <ErrorIcon />}
          </span>
          <code className="ml-2 break-words">{line.message}</code>
        </pre>
      ))}
    </div>
  );
};
