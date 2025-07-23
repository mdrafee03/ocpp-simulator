import { useEffect, useRef } from "react";
import { ArrowDown } from "../../Icons/ArrowDown";
import { ArrowUp } from "../../Icons/ArrowUp";
import { ClearIcon } from "../../Icons/ClearIcon";
import { ErrorIcon } from "../../Icons/ErrorIcon";
import { InfoIcon } from "../../Icons/InfoIcon";
import { useLoggerStore } from "../../store/useLoggerStore";

export const LogConsole = () => {
  const messages = useLoggerStore((state) => state.messages);
  const clearMessages = useLoggerStore((state) => state.clear);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-base-300 rounded-lg flex flex-col h-full">
      <div className="bg-base-100 text-base-content p-2 rounded-t-lg flex items-center gap-2 shadow-md border-b border-base-300">
        <ClearIcon onClick={clearMessages} />
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2"
        style={{
          maxHeight: "calc(100vh - 200px)",
          minHeight: "360px",
        }}
      >
        {messages.map((line, idx) => (
          <pre key={idx} className="flex items-start py-1 text-sm">
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
    </div>
  );
};
