export default function TopButtonBar({ activeView, setActiveView }) {
  const buttonStyles = {
    comparison: "from-blue-700 to-blue-500",
    attributes: "from-cyan-700 to-cyan-500",
    similarity: "from-yellow-600 to-yellow-400",
    shotchart: "from-red-700 to-red-500",
  };

  const buttons = [
    { label: "Player Comparison", view: "comparison" },
    { label: "Player Attributes", view: "attributes" },
    { label: "Player Similarity", view: "similarity" },
    { label: "Player Shot Chart", view: "shotchart" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 px-4">
      {buttons.map(({ label, view }) => (
        <button
          key={view}
          onClick={() => setActiveView(view)}
          className={`w-full px-4 py-3 text-white font-bold rounded-xl shadow-md bg-gradient-to-r ${buttonStyles[view]} hover:scale-105 transform transition duration-200 border border-gray-200 ${
            activeView === view ? "ring-2 ring-white" : ""
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
