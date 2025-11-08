export default function StandingList({ standingData, logos }) {
    return (
        <div className="flex flex-col p-3 gap-0">
            {standingData.map((team, index) => (
            <div
                key={team.TeamAbbr}
                className="flex items-center py-2 border-b last:border-b-0"
            >
                <div className="w-8 text-lg font-bold text-blue-600 text-center mr-4">
                {index + 1}.
                </div>
                {/* Team logo */}
                <img
                src={logos[index]}
                alt={team.TeamAbbr}
                className="w-10 h-10"
                />
                {/* City + Team name */}
                <div className="flex flex-col ml-3 flex-1">
                <span className="font-semibold">{team.TeamName}</span>
                <span className="text-sm text-gray-500">
                    {team.TeamAbbr} {team.ClinchIndicator}
                </span>
                </div>
                {/* Record */}
                <div className="text-right font-medium w-16">
                {team.WINS}-{team.LOSSES}
                </div>
            </div>
            ))}
        </div>
    );
};

