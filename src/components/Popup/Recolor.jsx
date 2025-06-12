import React, { useState } from "react";
function Recolor({ editparms, setEditParms }) {
  const [first, setfirst] = useState("");
  const [second, setsecond] = useState("");
  const handleSubmit = () => {
    setEditParms({
      ...editparms,
      recolor: [first, second],
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-800 space-y-4">
      <h2 className="text-xl font-bold">change Color </h2>

      <div className="flex flex-col">
        <label htmlFor="angleInput" className="mb-1 font-medium text-sm">
          from:
        </label>
        <input
          type="text"
          id="angleInput"
          value={first}
          onChange={(e) => setfirst(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g., red, blue, etc."
        />
        <label htmlFor="angleInput" className="mb-1 font-medium text-sm">
          to:
        </label>
        <input
          type="text"
          id="angleInput"
          value={second}
          onChange={(e) => setsecond(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g., green, yellow, etc."
        />
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        Apply color
      </button>
    </div>
  );
}

export default Recolor;
