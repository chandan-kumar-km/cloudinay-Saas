import React, { useState } from "react";
function Remove({ editparms, setEditParms }) {
  const [things, setthings] = useState("");
  const handleSubmit = () => {
    setEditParms({
      ...editparms,
      remove: things,
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-800 space-y-4">
      <h2 className="text-xl font-bold">Remove</h2>

      <div className="flex flex-col">
        <label htmlFor="angleInput" className="mb-1 font-medium text-sm">
          Enter the things to Remove:
        </label>
        <input
          type="text"
          id="angleInput"
          value={things}
          onChange={(e) => setthings(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g., car, bike, etc."
        />
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        Apply Remove
      </button>
    </div>
  );
}

export default Remove;
