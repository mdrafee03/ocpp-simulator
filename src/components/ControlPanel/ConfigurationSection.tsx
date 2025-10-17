import { useConfigStore } from "../../store/useConfigStore";
import { useChargersStore } from "../../store/useChargersStore";
import { useServerStore } from "../../store/useServerStore";

export const ConfigurationSection = () => {
  const { config, setConfig } = useConfigStore();
  const { chargers } = useChargersStore();
  const { servers } = useServerStore();

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="form-control">
        <label className="label block">Server</label>
        <select
          className="select select-bordered h-12 text-base w-full"
          value={config.serverName}
          onChange={(e) => setConfig({ ...config, serverName: e.target.value })}
        >
          {servers.map((server) => (
            <option key={server.id} value={server.name}>
              {server.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label className="label block">Charger Serial Number</label>
        <select
          className="select select-bordered h-12 text-base w-full"
          value={config.serialNumber}
          onChange={(e) =>
            setConfig({ ...config, serialNumber: e.target.value })
          }
        >
          {chargers.map((charger) => (
            <option key={charger.id} value={charger.serialNumber}>
              {charger.serialNumber}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
