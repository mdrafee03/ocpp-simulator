import "./App.css";
import { Simulator } from "./components/Simulator/Simulator";
import { WebSocketProvider } from "./store/WebSocketContext";
import { SettingsButton } from "./components/Settings/SettingsButton";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import { Footer } from "./components/Footer";

function App() {
  return (
    <ThemeProvider>
      <div className="h-screen bg-base-200 text-base-content flex flex-col relative overflow-hidden">
        <div className="flex-1 p-6 flex flex-col min-h-0 overflow-hidden">
          <div className="grid grid-cols-3 items-center mb-6 flex-shrink-0">
            <div></div>
            <h1 className="text-3xl font-bold text-center">
              OCPP 1.6 Charger Simulator
            </h1>
            <div className="flex items-center gap-4 justify-end">
              <ThemeToggle />
              <SettingsButton />
            </div>
          </div>
          <div className="flex-1 overflow-hidden min-h-0">
            <WebSocketProvider>
              <Simulator />
            </WebSocketProvider>
          </div>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
