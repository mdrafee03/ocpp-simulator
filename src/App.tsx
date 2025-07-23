import "./App.css";
import { Simulator } from "./components/Simulator/Simulator";
import { WebSocketProvider } from "./store/WebSocketContext";
import { SettingsButton } from "./components/Settings/SettingsButton";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  return (
    <ThemeProvider>
      <div className="h-screen bg-base-200 text-base-content p-6 flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h1 className="text-3xl font-bold">OCPP 1.6 Charger Simulator</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <SettingsButton />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <WebSocketProvider>
            <Simulator />
          </WebSocketProvider>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
