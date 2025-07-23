import { useState } from "react";
import { ControlPanel } from "../ControlPanel/ControlPanel";
import { Indicators } from "../Indicator/Indicator";
import { LogConsole } from "../LogConsole/LogConsole";
import { useProcessWebhook } from "../../hooks/useProcessWebhook";

export const Simulator = () => {
  useProcessWebhook();
  const [indicators] = useState({
    red: true,
    green: false,
    blue: false,
    yellow: false,
  });

  return (
    <div className="flex-1 flex h-full w-full">
      <div className="flex-1 flex-col gap-4 p-4">
        <ControlPanel />
        <Indicators indicators={indicators} />
      </div>
      <div className="flex-2 p-2 pb-0 overflow-auto">
        <LogConsole />
      </div>
    </div>
  );
};
