import {useState, useEffect} from "react";
import TopButtonBar from "./lib/TopButtonBar.js";
import DynamicPlayerForm from "./forms/DynamicPlayerForm.js";
import ChartDisplay from "./lib/ChartDisplay.js";
import { useParams } from "react-router-dom";
import Profile from "./lib/Profile.js";




export default function Player() {
  const { id } = useParams();
  const [activeView, setActiveView] = useState("attributes");
  const [isLoading, setIsLoading] = useState(false);

  const [playerAComparison, setplayerAComparison] = useState("");
  const [yearAComparison, setyearAComparison] = useState("");
  const [comparisonAData, setAComparisonData] = useState([]);

  const [playerBComparison, setplayerBComparison] = useState("");
  const [yearBComparison, setyearBComparison] = useState("");
  const [comparisonBData, setBComparisonData] = useState([]);


  const [playerAttributes, setAttributesPlayer] = useState("");
  const [yearAttributes, setAttributesYear] = useState("");
  const [attributesData, setAttributesData] = useState([]);
  const [chartType, setChartType] = useState("standard");
  const [attributeScope, setAttributeScope] = useState("overall");

  const [playerShotChart, setShotChartPlayer] = useState(null); 
  const [shotChartData, setShotChartData] = useState(null); 
  
  
  let chartProps = {};
  useEffect(() => {
    if (!id) return;

    const loadPlayer = async () => {
      try {
        const res = await fetch(`/api/player_info/${id}`);
        const data = await res.json();

        // Set default values for all chart views
        setplayerAComparison(data.DISPLAY_FIRST_LAST);
        setyearAComparison("2025");
        setplayerBComparison(data.DISPLAY_FIRST_LAST);
        setyearBComparison("2025");

        setAttributesPlayer(data.DISPLAY_FIRST_LAST);
        setAttributesYear("2025");

        setShotChartPlayer(data.DISPLAY_FIRST_LAST);
      } catch (err) {
        console.error("Failed to load player info:", err);
      }
    };

    loadPlayer();
  }, [id]);
  if (activeView === "comparison") {
    chartProps = {
      playerAComparison,setplayerAComparison,
      yearAComparison,setyearAComparison,
      comparisonAData,setAComparisonData,
      playerBComparison,setplayerBComparison,
      yearBComparison,setyearBComparison,
      comparisonBData,setBComparisonData,
      isLoading,setIsLoading
    };
  } 
  else if (activeView === "attributes") {
    chartProps = {
      chartType,setChartType,
      attributeScope,setAttributeScope,
      playerAttributes,setAttributesPlayer,
      yearAttributes,setAttributesYear,
      attributesData,setAttributesData,
      isLoading,setIsLoading
    };
  }
  else if (activeView === "shotchart") {
    chartProps = {
      playerShotChart,setShotChartPlayer,
      shotChartData,setShotChartData,
      isLoading,setIsLoading
    }
  }
  return (
    <div className="bg-surface_2">
      <Profile id={id}/>
      <TopButtonBar setActiveView={setActiveView} />
      <DynamicPlayerForm activeView={activeView} chartProps={chartProps}/>
      <ChartDisplay activeView={activeView} chartProps={chartProps}/>
    </div>
  );
}