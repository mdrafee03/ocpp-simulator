import { Environments } from "../../constants/constants";
import { useConfigStore } from "../../store/useConfigStore";
import { useChargersStore } from "../../store/useChargersStore";

export const ConfigurationSection = () => {
  const { config, setConfig } = useConfigStore();
  const { chargers } = useChargersStore();

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="form-control">
        <label className="label block">Environment</label>
        <select
          className="select select-bordered h-12 text-base w-full"
          value={config.env}
          onChange={(e) =>
            setConfig({ ...config, env: e.target.value as Environments })
          }
        >
          {Object.keys(Environments).map((env) => (
            <option key={env} value={env}>
              {env}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label className="label block">Charger Serial</label>
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
