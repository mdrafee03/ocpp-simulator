import { ConfigurationSection } from "./ConfigurationSection";
import { ConnectionStatus } from "./ConnectionStatus";
import { OcppActions } from "./OcppActions";
import { MeterControls } from "./MeterControls";
import { StatusControls } from "./StatusControls";

export const ControlPanel = () => {
  return (
    <div className="w-full space-y-4 flex-shrink-0">
      <ConfigurationSection />
      <ConnectionStatus />
      <OcppActions />
      <MeterControls />
      <StatusControls />
    </div>
  );
};
