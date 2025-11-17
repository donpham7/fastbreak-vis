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

    // Removes accents, normalizes spacing, hyphenated names, apostrophes, and suffixes
    const normalizePlayerName = (str) => {
    // 1. Remove accents/diacritics
    let clean = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 2. Normalize spacing
    clean = clean.replace(/\s+/g, " ").trim();

    // 3. Auto-capitalize each word, including hyphenated and apostrophe parts
    const capitalizeWord = (word) => {
        return word
        .split(/[-']/) // split on hyphen or apostrophe
        .map(
            (part) =>
            part.length > 0
                ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                : ""
        )
        .join(word.includes("-") ? "-" : "'"); // rejoin with original separator
    };

    clean = clean
        .split(" ")
        .map(capitalizeWord)
        .join(" ");

    // 4. Normalize suffixes
    clean = clean.replace(/\bJr\b\.?/i, "Jr."); // always "Jr."
    clean = clean.replace(/\bIi\b/i, "II");     // always "II"
    clean = clean.replace(/\bIii\b/i, "III");   // always "III"

    return clean;
    };




    useEffect(() => {
        if (!id) return;

        const loadPlayer = async () => {
            setIsPageLoading(true);
            setPlayerLoaded(false);
            try {
                const res = await fetch(`/api/players/info/${id}`);
                const data = await res.json();

                // Strip accents from player name
                const cleanName = normalizePlayerName(data.DISPLAY_FIRST_LAST);

                // Set default values for all chart views
                setplayerAComparison(cleanName);
                setyearAComparison("2025");
                setplayerBComparison(cleanName);
                setyearBComparison("2025");

                setAttributesPlayer(cleanName);
                setAttributesYear("2025");

                setShotChartPlayer(cleanName);

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