import React from "react";

function RemoveBackground({ editparms, setEditParms }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-gray-800">
      <h2 className="text-lg font-semibold mb-4">remove Background ?</h2>
      <button
        className="btn"
        onClick={() => {
          setEditParms({
            ...editparms,
            removeBackground: true,
          });
        }}
      >
        confirm
      </button>
    </div>
  );
}

export default RemoveBackground;
