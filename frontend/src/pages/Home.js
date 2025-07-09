import React, { useEffect, useState } from "react";

export default function Home() {
  const [season, setSeason] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [seasonSearch, setSeasonSearch] = useState("");
  const [playerIdSearch, setPlayerIdSearch] = useState("");

  const findSimilarPlayer = () => {
    fetch(`/api/player_similarities/${seasonSearch}/${playerIdSearch}`)
      .then((res) => res.json())
      .then((data) => {
        setSeason(data.season);
        setPlayerName(data.player_name);
      });
  };

  return (
    <div>
      <h1>🏠 Home Page</h1>
      <input
        type="text"
        placeholder="Enter playerid"
        onChange={(e) => setPlayerIdSearch(e.target.value)}
      ></input>
      <input
        type="text"
        placeholder="Enter year"
        onChange={(e) => setSeasonSearch(parseInt(e.target.value))}
      ></input>
      <button onClick={findSimilarPlayer}>Search</button>
      <h1>{playerName}</h1>
      <h1>{season}</h1>
    </div>
  );
}
