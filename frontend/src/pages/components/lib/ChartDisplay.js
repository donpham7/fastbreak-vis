import MirrorBarChart from "./MirrorBarChart";
import RadarChart from "./RadarChart";
import ShotChart from "./ShotChart";
import ImpactChart from "./ImpactChart";

export default function ChartDisplay({ activeView, chartProps }) {
    const baseStyles = "w-full md:w-[50%] rounded-2xl shadow-lg p-6 mb-6 border mx-auto";

    const headingStyles = "text-xl font-extrabold tracking-wide mb-4 font-roboto flex justify-center items-center";

    switch (activeView) {
    case "comparison":
        return (
            <div className={`${baseStyles} border-blue-800`}>
                <h2 className={`${headingStyles} text-blue-800`}>
                {chartProps.playerAComparison} {chartProps.yearAComparison} vs {chartProps.playerBComparison} {chartProps.yearBComparison} — Season Stats per 36 Min
                </h2>
                {chartProps.isLoading ? (
                    <p>Loading chart data...</p>
                    ) : !chartProps.comparisonAData || chartProps.comparisonAData.length === 0 || !chartProps.comparisonBData || chartProps.comparisonBData.length === 0? (
                    <p>No data available</p>
                    ) :  (
                    <div className="flex justify-center">
                        <MirrorBarChart
                            playerAData={chartProps.comparisonAData}
                            playerBData={chartProps.comparisonBData}
                        />
                    </div>
                )}
            </div>
        );

    case "attributes":
        return (
            <div className={`${baseStyles} border-cyan-700`}>
                <div className="flex flex-row justify-between items-center mb-4 gap-4">
                    <h2 className={`${headingStyles} text-cyan-800`}>
                        {chartProps.playerAttributes} {chartProps.yearAttributes} — Attribute Percentiles
                    </h2>
                    <select
                        value={chartProps.chartType}
                        onChange={(e) => chartProps.setChartType(e.target.value)}
                        className="px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black text-lg w-48"
                    >
                    <option value="standard">Standard</option>
                    <option value="impact">Impact</option>
                    </select>
                </div>

                {chartProps.isLoading ? (
                    <p>Loading chart data...</p>
                    ) : !chartProps.attributesData || chartProps.attributesData.length === 0 ? (
                    <p>No data available</p>
                    ) : chartProps.chartType === "standard" ? (
                    <div className="flex justify-center">
                        <RadarChart playerData={chartProps.attributesData} />
                    </div>
                    ) : (
                    <div className="flex justify-center">
                        <ImpactChart playerData={chartProps.attributesData} />
                    </div>
                )}

            </div>
        );



    case "shotchart":
        return (
            <div className={`${baseStyles} border-[#FF4040]`}>
                <h2 className={`${headingStyles} text-red-700`}>
                    {chartProps.playerShotChart} — Career Shot Chart
                </h2>

                {chartProps.isLoading ? (
                    <p>Loading chart data...</p>
                ) : !chartProps.shotChartData || chartProps.shotChartData.length === 0 ? (
                    <p>No data available</p>
                ) : (
                    <div className="flex justify-center">
                        <ShotChart playerData={chartProps.shotChartData ?? []} />
                    </div>
                )}
            </div>
        );


    default:
        return null;
    }
}
