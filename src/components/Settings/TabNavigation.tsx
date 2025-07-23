interface TabNavigationProps {
  activeTab: "environments" | "chargers";
  onTabChange: (tab: "environments" | "chargers") => void;
}

export const TabNavigation = ({
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <div className="tabs tabs-boxed mb-4">
      <button
        className={`tab ${activeTab === "environments" ? "tab-active" : ""}`}
        onClick={() => onTabChange("environments")}
      >
        Environment URLs
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
