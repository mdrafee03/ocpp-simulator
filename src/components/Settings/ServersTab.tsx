import { useState } from "react";
import { useServerStore, type Server } from "../../store/useServerStore";

export const ServersTab = () => {
  const { servers, addServer, updateServer, deleteServer } = useServerStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleEdit = (server: Server) => {
    setEditingId(server.id);
    setEditName(server.name);
    setEditUrl(server.url);
  };

  const handleSave = (id: string) => {
    if (editName.trim() && editUrl.trim()) {
      updateServer(id, editName, editUrl);
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditUrl("");
  };

  const handleDelete = (id: string) => {
    if (servers.length > 1) {
      deleteServer(id);
    } else {
      alert("You must have at least one server configured.");
    }
  };

  const handleAdd = () => {
    if (newName.trim() && newUrl.trim()) {
      const newServer: Server = {
        id: Date.now().toString(),
        name: newName,
        url: newUrl,
      };
      addServer(newServer);
      setNewName("");
      setNewUrl("");
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {servers.map((server) => (
          <div
            key={server.id}
            className="p-4 bg-base-200 rounded-lg border border-base-300"
          >
            {editingId === server.id ? (
              <div className="space-y-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Server Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Server URL</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(server.id)}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-ghost btn-sm flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-base-content">
                      {server.name}
                    </h3>
                    <p className="text-sm text-base-content/70 break-all">
                      {server.url}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(server)}
                      className="btn btn-ghost btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(server.id)}
                      className="btn btn-ghost btn-sm text-error"
                      disabled={servers.length === 1}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="p-4 bg-base-200 rounded-lg border border-base-300 space-y-3">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Server Name</span>
            </label>
            <input
              type="text"
              placeholder="Production"
              className="input input-bordered w-full"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Server URL</span>
            </label>
            <input
              type="text"
              placeholder="wss://your-server.com/ocpp/"
              className="input input-bordered w-full"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="btn btn-primary btn-sm flex-1"
            >
              Add Server
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewName("");
                setNewUrl("");
              }}
              className="btn btn-ghost btn-sm flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-outline btn-primary w-full"
        >
          + Add New Server
        </button>
      )}
    </div>
  );
};
