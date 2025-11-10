import {useEffect} from "react";


export default function ComparisonFields({ chartProps }) {
    function handleSearch() {
        if (
            !chartProps.playerAComparison ||
            !chartProps.playerBComparison ||
            isNaN(chartProps.yearAComparison) ||
            isNaN(chartProps.yearBComparison)
        ) {
            alert("Please enter valid player names and years");
            return;
        }

        chartProps.setIsLoading(true);
        Promise.all([
            fetch(
            `/api/players/comparison/${chartProps.yearAComparison}/${chartProps.playerAComparison}`
            ).then((res) => res.json()),
            fetch(
            `/api/players/comparison/${chartProps.yearBComparison}/${chartProps.playerBComparison}`
            ).then((res) => res.json()),
        ])
            .then(([dataA, dataB]) => {
            if (
                !dataA ||
                !dataB ||
                Object.keys(dataA).length === 0 ||
                Object.keys(dataB).length === 0
            ) {
                alert("One or more players could not be found");
                return;
            }
            chartProps.setAComparisonData(dataA);
            chartProps.setBComparisonData(dataB);
            })
            .catch((err) => {
                console.log("error", err);
                alert(`Failed to fetch data: ${err.message}`);
            })
            .finally(() => {
                chartProps.setIsLoading(false);
            });
    }

    // useEffect(() => {
    //     if (chartProps.playerAComparison && chartProps.yearAComparison) {
    //         handleSearch();
    //     }
    // }, [chartProps.playerAComparison, chartProps.yearAComparison]);


    return (
        <div className="w-full md:w-[50%] rounded-2xl border border-blue-800 bg-gradient-to-br from-[#FF00FF] to-cyan-700 shadow-lg p-8 mx-auto mb-6 font-roboto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-white tracking-wide">
                Player Comparison
                </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter Player A"
                        onChange={(e) => chartProps.setplayerAComparison(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                </div>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter Year "
                        onChange={(e) => chartProps.setyearAComparison(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                </div>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter Player B"
                        onChange={(e) => chartProps.setplayerBComparison(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                    />
                </div>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter Year "
                        onChange={(e) => chartProps.setyearBComparison(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                    />
                </div>
                <div className="space-y-4">
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-cyan-700 text-white font-bold rounded-xl shadow-md hover:scale-105 transform transition duration-200 border border-gray-200"
                    >
                    Search
                    </button>
                </div>
            </div>
        </div>
    );
}
