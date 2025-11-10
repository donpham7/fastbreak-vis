import {useState, useEffect, useMemo} from "react";
import { useParams } from "react-router-dom";

import { Header } from '@components';
import { TopButtonBar, DynamicPlayerForm, ChartDisplay, Profile } from '@pages/Player';





export default function Player() {
    const { id } = useParams();
    const [playerLoaded, setPlayerLoaded] = useState(false);
    const [activeView, setActiveView] = useState("attributes");
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isChartLoading, setIsChartLoading] = useState(false);

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


    useEffect(() => {
        if (!id) return;

        const loadPlayer = async () => {
            setIsPageLoading(true);
            setPlayerLoaded(false);
            try {
                const res = await fetch(`/api/players/info/${id}`);
                const data = await res.json();

                // Set default values for all chart views
                setplayerAComparison(data.DISPLAY_FIRST_LAST);
                setyearAComparison("2025");
                setplayerBComparison(data.DISPLAY_FIRST_LAST);
                setyearBComparison("2025");

                setAttributesPlayer(data.DISPLAY_FIRST_LAST);
                setAttributesYear("2025");

                setShotChartPlayer(data.DISPLAY_FIRST_LAST);

                setPlayerLoaded(true);
            } catch (err) {
                console.error("Failed to load player info:", err);
            } finally {
                setIsPageLoading(false);
            }
        };

    loadPlayer();
    }, [id]);


    const chartProps = useMemo(() => {
        if (activeView === "comparison") return {
            playerAComparison,setplayerAComparison,
            yearAComparison,setyearAComparison,
            comparisonAData,setAComparisonData,
            playerBComparison,setplayerBComparison,
            yearBComparison,setyearBComparison,
            comparisonBData,setBComparisonData,
            isLoading: isChartLoading,
            setIsLoading: setIsChartLoading
        };

        if (activeView === "attributes") return {
            chartType,setChartType,
            attributeScope,setAttributeScope,
            playerAttributes,setAttributesPlayer,
            yearAttributes,setAttributesYear,
            attributesData,setAttributesData,
            isLoading: isChartLoading,
            setIsLoading: setIsChartLoading
        };

        if (activeView === "shotchart") return {
            playerShotChart,setShotChartPlayer,
            shotChartData,setShotChartData,
            isLoading: isChartLoading,
            setIsLoading: setIsChartLoading
        };
        return {};
    }, [
        activeView, chartType, attributeScope,
        playerAComparison, yearAComparison, comparisonAData,
        playerBComparison, yearBComparison, comparisonBData,
        playerAttributes, yearAttributes, attributesData,
        playerShotChart, shotChartData, isChartLoading,
    ]);

    if (isPageLoading || !playerLoaded) {
        return (
            <div className="bg-surface_2 min-h-screen flex flex-col items-center justify-center">
                <Header/>
                <Profile id={id}/>
                <p className="text-gray-600 text-lg mt-8">Loading player data...</p>
            </div>
        );
    }

    return (
        <div className="bg-surface_2">
            <Header/>
            <Profile id={id}/>
            <TopButtonBar setActiveView={setActiveView} />
            <DynamicPlayerForm activeView={activeView} chartProps={chartProps}/>
            <ChartDisplay activeView={activeView} chartProps={chartProps}/>
        </div>
    );
};