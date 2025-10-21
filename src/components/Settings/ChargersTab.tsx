import { useState } from "react";
import { useChargersStore, type Charger } from "../../store/useChargersStore";
import { useToastStore } from "../../store/useToastStore";

export const ChargersTab = () => {
  const { chargers, addCharger, updateCharger, deleteCharger } =
    useChargersStore();
  const { showToast } = useToastStore();
  const [newChargerSerial, setNewChargerSerial] = useState("");
  const [editingCharger, setEditingCharger] = useState<Charger | null>(null);
  const [editSerial, setEditSerial] = useState("");

  const handleAddCharger = () => {
    if (newChargerSerial.trim()) {
      addCharger(newChargerSerial.trim());
      setNewChargerSerial("");
      showToast("Charger added successfully", "success");
    }
  };

  const handleEditCharger = (charger: Charger) => {
    setEditingCharger(charger);
    setEditSerial(charger.serialNumber);
  };

  const handleSaveEdit = () => {
    if (editingCharger && editSerial.trim()) {
      updateCharger(editingCharger.id, editSerial.trim());
      setEditingCharger(null);
      setEditSerial("");
      showToast("Charger updated successfully", "success");
    }
  };

  const handleCancelEdit = () => {
    setEditingCharger(null);
    setEditSerial("");
  };

  const handleDeleteCharger = (id: string) => {
    deleteCharger(id);
    showToast("Charger deleted successfully", "success");
  };

  return (
    <div className="space-y-4">
      {/* Add new charger section */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter charger serial number"
          className="input input-bordered flex-1 bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={newChargerSerial}
          onChange={(e) => setNewChargerSerial(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddCharger()}
        />
        <button
          onClick={handleAddCharger}
          className="btn btn-primary"
          disabled={!newChargerSerial.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      {/* Chargers table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chargers.map((charger) => (
              <tr key={charger.id}>
                <td>
                  {editingCharger?.id === charger.id ? (
                    <input
                      type="text"
                      className="input input-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      value={editSerial}
                      onChange={(e) => setEditSerial(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                    />
                  ) : (
                    charger.serialNumber
                  )}
                </td>
                <td>
                  <div className="flex gap-2">
                    {editingCharger?.id === charger.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="btn btn-success"
                          disabled={!editSerial.trim()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn btn-ghost"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditCharger(charger)}
                          className="btn btn-info"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCharger(charger.id)}
                          className="btn btn-error"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
