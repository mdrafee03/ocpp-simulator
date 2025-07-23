import { useState } from "react";
import { useEnvironmentStore } from "../../store/useEnvironmentStore";

export const EnvironmentTab = () => {
  const { environments, updateEnvironment } = useEnvironmentStore();
  const [localUrl, setLocalUrl] = useState(
    environments.find((env) => env.name === "Local")?.url || ""
  );
  const [devUrl, setDevUrl] = useState(
    environments.find((env) => env.name === "Dev")?.url || ""
  );

  const handleSaveEnvironmentUrls = () => {
    updateEnvironment("Local", localUrl);
    updateEnvironment("Dev", devUrl);
  };

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium text-base-content">
            Local URL
          </span>
        </label>
        <input
          type="text"
          placeholder="ws://localhost:8080"
          className="input input-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={localUrl}
          onChange={(e) => setLocalUrl(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium text-base-content">
            Dev URL
          </span>
        </label>
        <input
          type="text"
          placeholder="wss://dev.example.com"
          className="input input-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={devUrl}
          onChange={(e) => setDevUrl(e.target.value)}
        />
      </div>

      <button
        onClick={handleSaveEnvironmentUrls}
        className="btn btn-primary w-full mt-4"
      >
        Save Environment URLs
      </button>
    </div>
  );
};
