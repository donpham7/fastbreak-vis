import {useState} from "react";
import MirrorBarChart from "./components/lib/MirrorBarChart";


export default function About() {

  const [yearASearch, setyearASearch] = useState("");
  const [playerASearch, setplayerASearch] = useState("");
  const [playerAData, setMirrorDataA] = useState([]);

  const [yearBSearch, setyearBSearch] = useState("");
  const [playerBSearch, setplayerBSearch] = useState("");
  const [playerBData, setMirrorDataB] = useState([]);

  const [isLoading, setIsLoading] = useState(false);


  function handleSearch() {
    if (!playerASearch || !playerBSearch || isNaN(yearASearch) || isNaN(yearBSearch)) {
      alert("Please enter valid player names and years");
      return;
    }

    setIsLoading(true);
    Promise.all([
      fetch(`/api/MirrorBarChart/${yearASearch}/${playerASearch}`).then((res) => res.json()),
      fetch(`/api/MirrorBarChart/${yearBSearch}/${playerBSearch}`).then((res) => res.json())
    ])
    .then(([dataA, dataB]) => {
      if(!dataA || !dataB || Object.keys(dataA).length === 0 || Object.keys(dataB).length === 0) {
        alert("One or more players could not be found");
        return;
      }
        setMirrorDataA(dataA);
        setMirrorDataB(dataB);
      })
    .finally(() => {
      setIsLoading(false);
    })
  }


  return (
    <div className="fixed-grid has-3-cols has-background-white">
      <div className="grid">
        <div className="cell">
          <div className="panel is-info">
            <p className="panel-heading">Player Comparison</p>
              <div className="panel-block has-text-black">
                <div>
                  <input
                    type="text"
                    placeholder="Enter PlayerA"
                    onChange={(e) => setplayerASearch(e.target.value)}
                  ></input>
                  <input
                    type="text"
                    placeholder="Enter YearA"
                    onChange={(e) => setyearASearch(e.target.value)}
                  ></input>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter PlayerB"
                    onChange={(e) => setplayerBSearch(e.target.value)}
                  ></input>
                  <input
                    type="text"
                    placeholder="Enter YearB"
                    onChange={(e) => setyearBSearch(e.target.value)}
                  ></input>
                </div>
              <button onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>
        <div className="cell">2</div>
        <div className="cell">3</div>
        <div className="cell is-col-span-2 is half-height">
          <div className="panel is-info">
            <p className="panel-heading">{playerASearch} {yearASearch} - Season stats per 36 min - {playerBSearch} {yearBSearch}</p>
              {isLoading ? (
                <p>Loading chart data...</p>
              ) : (
                playerAData && playerBData ? (
                  <MirrorBarChart
                    playerAData={playerAData ?? []}
                    playerBData={playerBData ?? []}
                  />
                ) : (
                  <p>No data available</p>
                )
              )}
          </div>
        </div>
        <div className="cell">6</div>
      </div>
    </div>
  );
};
