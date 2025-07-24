import { ControlPanel } from "../ControlPanel/ControlPanel";
import { LogConsole } from "../LogConsole/LogConsole";
import { useProcessWebhook } from "../../hooks/useProcessWebhook";

export const Simulator = () => {
  useProcessWebhook();

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full lg:items-start overflow-hidden">
      <div className="lg:w-1/2 flex flex-col p-4 overflow-y-auto min-h-0 h-full">
        <div className="space-y-4 pb-6">
          <ControlPanel />
        </div>
      </div>
      <div className="lg:flex-1 p-2 pb-0 overflow-hidden flex flex-col min-h-0">
        <LogConsole />
      </div>
    </div>
  );
};
