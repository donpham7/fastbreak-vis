import MirrorBarChart from "./MirrorBarChart";
import RadarChart from "./RadarChart";
import ShotChart from "./ShotChart";
import ImpactChart from "./ImpactChart";

export default function ChartDisplay({ activeView, chartProps }) {
  const baseStyles = "rounded-2xl shadow-lg p-6 mb-6 border";
  const headingStyles = "text-xl font-extrabold tracking-wide mb-4";

  switch (activeView) {
    case "comparison":
      return (
        <div className={`${baseStyles} border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-100`}>
          <h2 className={`${headingStyles} text-blue-800`}>
            {chartProps.playerAComparison} {chartProps.yearAComparison} vs {chartProps.playerBComparison} {chartProps.yearBComparison} — Season Stats per 36 Min
          </h2>
          {chartProps.isLoading ? (
            <p>Loading chart data...</p>
          ) : chartProps.comparisonAData && chartProps.comparisonBData ? (
            <MirrorBarChart
              playerAData={chartProps.comparisonAData ?? []}
              playerBData={chartProps.comparisonBData ?? []}
            />
          ) : (
            <p>No data available</p>
          )}
        </div>
      );

case "attributes":
  return (
    <div className={`${baseStyles} border-cyan-800 bg-gradient-to-br from-cyan-50 to-blue-100`}>
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
      ) : chartProps.chartType === "standard" && chartProps.attributesData ? (
        <RadarChart playerData={chartProps.attributesData ?? []} />
      ) : chartProps.chartType === "impact" && chartProps.attributesData ? (
        <ImpactChart playerData={chartProps.attributesData ?? []} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );



    case "shotchart":
      return (
        <div className={`${baseStyles} border-red-800 bg-gradient-to-br from-red-50 to-orange-100`}>
          <h2 className={`${headingStyles} text-red-700`}>
            {chartProps.playerShotChart} — Career Shot Chart
          </h2>
          {chartProps.isLoading ? (
            <p>Loading chart data...</p>
          ) : chartProps.shotChartData ? (
            <ShotChart playerData={chartProps.shotChartData ?? []} />
          ) : (
            <p>No data available</p>
          )}
        </div>
      );

    default:
      return null;
  }
}
