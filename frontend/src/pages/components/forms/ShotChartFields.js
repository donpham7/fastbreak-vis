import {useEffect} from "react";



export default function ShotChartFields({ chartProps }) {
  function handleSearch() {
    if (!chartProps.playerShotChart) {
      alert("Please enter valid player name");
      return;
    }

    chartProps.setIsLoading(true);
    fetch(`/api/player_shotchart/${chartProps.playerShotChart}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          alert("Player could not be found");
          return;
        }
        chartProps.setShotChartData(data);
      })
      .catch((err) => {
        console.log("error", err);
        alert(`Failed to fetch data: ${err.message}`);
      })
      .finally(() => {
        chartProps.setIsLoading(false);
      });
  }

  useEffect(() => {
  if (chartProps.playerShotChart) {
    handleSearch();
  }
}, [chartProps.playerShotChart]);

  return (
    <div className="rounded-2xl border border-red-800 bg-gradient-to-br from-red-50 to-orange-100 shadow-lg p-8 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-red-700 tracking-wide">
          Player Shot Chart
        </h2>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-gradient-to-r from-red-700 to-orange-500 text-white font-bold rounded-xl shadow-md hover:scale-105 transform transition duration-200 border border-gray-200"
        >
          Search
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <input
          type="text"
          placeholder="Enter Player Name"
          onChange={(e) => chartProps.setShotChartPlayer(e.target.value)}
          className="w-full md:w-2/3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
        />
      </div>
    </div>
  );
}
