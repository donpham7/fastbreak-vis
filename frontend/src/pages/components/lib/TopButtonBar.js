export default function TopButtonBar({ activeView, setActiveView }) {
    const buttonStyles = {
        comparison: "from-[#FF00FF] to-cyan-700 hover:from-[#FF33CC] hover:to-[#00CED1]",
        attributes: "from-cyan-700 to-[#00FF7F] hover:from-[#00A3A3] hover:to-[#1EFFA0]",
        similarity: "from-[#0BDA51] to-[#ffee80] hover:from-[#00B140] hover:to-[#FFF89E]",
        shotchart: "from-[#ffee80] to-[#FF4040] hover:from-[#FFD700] hover:to-[#FF1C1C]",
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
