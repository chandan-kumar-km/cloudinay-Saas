import { useState } from "react";

function Angle({ editparms, setEditParms }) {
  const [angleValue, setAngleValue] = useState(0);

  const handleSubmit = () => {
    setEditParms({
      ...editparms,
      angle: Number(angleValue),
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-800 space-y-4">
      <h2 className="text-xl font-bold">Rotate</h2>

      <div className="flex flex-col">
        <label htmlFor="angleInput" className="mb-1 font-medium text-sm">
          Enter the rotation angle:
        </label>
        <input
          type="number"
          id="angleInput"
          value={angleValue}
          onChange={(e) => setAngleValue(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g., 90"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        Apply Rotation
      </button>
    </div>
  );
}

export default Angle;
