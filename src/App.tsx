import "./App.css";
import { Simulator } from "./components/Simulator/Simulator";
import { WebSocketProvider } from "./store/WebSocketContext";

function App() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content p-6 flex flex-col">
      <h1 className="text-3xl font-bold text-center mb-6">
        OCPP 1.6 Charger Simulator
      </h1>
      <div className="flex-1 flex flex-col h-screen">
        <WebSocketProvider>
          <Simulator />
        </WebSocketProvider>
      </div>
    </div>
  );
}

export default App;
