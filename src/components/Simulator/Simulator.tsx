import { ControlPanel } from "../ControlPanel/ControlPanel";
import { LogConsole } from "../LogConsole/LogConsole";
import { useProcessWebhook } from "../../hooks/useProcessWebhook";

export const Simulator = () => {
  useProcessWebhook();

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full lg:items-start overflow-hidden">
      <div className="lg:w-1/2 flex-col gap-4 p-4 overflow-y-auto">
        <ControlPanel />
      </div>
      <div className="lg:flex-1 p-2 pb-0 overflow-hidden flex flex-col">
        <LogConsole />
      </div>
    </div>
  );
};
