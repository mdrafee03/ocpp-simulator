import { ConfigurationSection } from "./ConfigurationSection";
import { ConnectionStatus } from "./ConnectionStatus";
import { OcppActions } from "./OcppActions";
import { MeterControls } from "./MeterControls";
import { StatusControls } from "./StatusControls";

export const ControlPanel = () => {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl space-y-4">
        <ConfigurationSection />
        <ConnectionStatus />
        <OcppActions />
        <MeterControls />
        <StatusControls />
      </div>
    </div>
  );
};
