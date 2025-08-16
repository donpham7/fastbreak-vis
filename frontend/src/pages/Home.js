import React, { useEffect, useState } from "react";
import { fetchTeamLogo } from "../lib/GetImages.js";

export default function Home() {
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    async function getLogo() {
      const url = await fetchTeamLogo("NOP"); // Example team name
      setLogoUrl(url);
    }
    getLogo();
  }, []);

  return (
    <div className="flex items-center justify-center bg-surface min-h-[200px]">
      <div className="rounded-xl p-8 bg-surface_2">
        <div className="flex flex-row items-center space-x-4">
          <img src={logoUrl} alt="Team Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-text underline">
            Hello world!
          </h1>
          <img src={logoUrl} alt="Team Logo" className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
}
