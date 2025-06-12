import { useState } from "react";

function Background({ editparms, setEditParms }) {
  const [color, setColor] = useState("white");

  const handleSubmit = () => {
    setEditParms({
      ...editparms,
      removeBackground: true,
      background: color,
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-800 space-y-4">
      <h2 className="text-xl font-bold">Apply Background</h2>

      <div className="flex flex-col">
        <label htmlFor="colorInput" className="mb-1 font-medium text-sm">
          Enter the color:
        </label>
        <input
          type="text"
          id="colorInput"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g., red, #f0f0f0, rgba(0,0,0,0.5)"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        Apply Background
      </button>
    </div>
  );
}

export default Background;
