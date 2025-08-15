import {useState} from "react";
import TopButtonBar from "./components/TopButtonBar.js";
import DynamicPlayerForm from "./components/forms/DynamicPlayerForm.js";
import ChartDisplay from "./components/ChartDisplay.js";



export default function About() {
  const [activeView, setActiveView] = useState("comparison");
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
    <div className="about-page">
      <TopButtonBar setActiveView={setActiveView} />
      <DynamicPlayerForm activeView={activeView} chartProps={chartProps}/>
      <ChartDisplay activeView={activeView} chartProps={chartProps}/>
    </div>
  );
}