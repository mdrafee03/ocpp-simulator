import { useState } from "react";
import { ModalHeader } from "./ModalHeader";
import { TabNavigation } from "./TabNavigation";
import { EnvironmentTab } from "./EnvironmentTab";
import { ChargersTab } from "./ChargersTab";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<"environments" | "chargers">(
    "environments"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-2xl max-h-[70vh] overflow-y-auto">
        <ModalHeader onClose={onClose} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "environments" && <EnvironmentTab />}
        {activeTab === "chargers" && <ChargersTab />}
      </div>
    </div>
  );
};
