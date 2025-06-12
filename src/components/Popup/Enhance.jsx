
function Enhance({ editparms, setEditParms }) {
  const handleSubmit = () => {
    setEditParms({
      ...editparms,
      enhance: true,
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-800 space-y-4">
      <h2 className="text-xl font-bold">Enhance Image ?</h2>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        Confirm
      </button>
    </div>
    )
}

export default Enhance