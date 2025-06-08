import { useState } from "react";
import { ControlPanel } from "../ControlPanel/ControlPanel";
import { Indicators } from "../Indicator/Indicator";
import { LogConsole } from "../LogConsole/LogConsole";
import { useProcessWebhook } from "../../hooks/useProcessWebhook";

export const Simulator = () => {
  useProcessWebhook();
  const [indicators, setIndicators] = useState({
    red: true,
    green: false,
    blue: false,
    yellow: false,
  });

  const toggleIndicator = (color: string) => {
    setIndicators({
      red: false,
      green: false,
      blue: false,
      yellow: false,
      [color]: true,
    });
  };
  //   set mock logs for 100 lines
  //   useEffect(() => {
  //     for (let i = 0; i < 100; i++) {
  //       logMsg(`Log message ${i + 1}`);
  //     }
  //   }, []);

  return (
    <div className="flex-1 flex h-full w-full">
      <div className="flex-1 flex-col gap-4 p-4">
        <ControlPanel toggleIndicator={toggleIndicator} />
        <Indicators indicators={indicators} />
      </div>
      <div className="flex-2 p-2 pb-0 overflow-auto">
        <LogConsole />
      </div>
    </div>
  );
};
