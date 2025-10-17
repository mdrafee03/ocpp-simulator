interface TabNavigationProps {
  activeTab: "servers" | "chargers";
  onTabChange: (tab: "servers" | "chargers") => void;
}

export const TabNavigation = ({
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <div className="tabs tabs-boxed mb-4">
      <button
        className={`tab ${activeTab === "servers" ? "tab-active" : ""}`}
        onClick={() => onTabChange("servers")}
      >
        Servers
      </button>
      <button
        className={`tab ${activeTab === "chargers" ? "tab-active" : ""}`}
        onClick={() => onTabChange("chargers")}
      >
        Chargers
      </button>
    </div>
  );
};
