from nba_api.stats.static import teams
from nba_api.stats.endpoints import leaguestandingsv3, leagueleaders

nba_teams = teams.get_teams()
id_to_abbr = {team["id"]: team["abbreviation"] for team in nba_teams}

GAMEHEADER = 0
LINESCORE = 1
SERIESSTANDINGS = 2
LASTMEETING = 3
EASTCONFSTANDINGSBYDAY = 4
WESTCONFSTANDINGSBYDAY = 5
AVAILABLE = 6
TEAMLEADERS = 7
TICKETLINKS = 8


def get_team_abbreviation(team_id):
    """
    Returns the abbreviation for a given NBA team ID.

        team_id (int): The unique identifier for the NBA team.

        str: The abbreviation corresponding to the provided team ID.

    Raises:
        KeyError: If the team_id does not exist in the id_to_abbr mapping.
    """
    return id_to_abbr[team_id]


def create_logo_lookup(team_abbr, year):
    if team_abbr == "PHX":
        team_abbr = "PHO"
    elif team_abbr == "BKN":
        team_abbr = "NJN"
    return str(team_abbr) + "-" + str(year)


def master_game_table(games, year):
    with_points = get_points(games)
    with_abbreviations_and_logos = get_abbreviations_and_logos(with_points, year)
    return with_abbreviations_and_logos


def get_points(games):
    merged = (
        games[GAMEHEADER]
        .merge(
            games[LINESCORE][["TEAM_ID", "PTS"]],
            left_on="HOME_TEAM_ID",
            right_on="TEAM_ID",
            how="left",
        )
        .rename(columns={"PTS": "HOME_SCORE"})
    )

    # Merge away scores
    merged = merged.merge(
        games[LINESCORE][["TEAM_ID", "PTS"]],
        left_on="VISITOR_TEAM_ID",
        right_on="TEAM_ID",
        how="left",
    ).rename(columns={"PTS": "AWAY_SCORE"})

    merged.drop(columns=["TEAM_ID_x", "TEAM_ID_y"], inplace=True)
    return merged


def get_abbreviations_and_logos(games, year):
    games["HOME_ABBREVIATION"] = games.apply(
        lambda row: get_team_abbreviation(row["HOME_TEAM_ID"]), axis=1
    )
    games["VISITOR_ABBREVIATION"] = games.apply(
        lambda row: get_team_abbreviation(row["VISITOR_TEAM_ID"]), axis=1
    )
    games["HOME_IMG"] = games.apply(
        lambda row: create_logo_lookup(row["HOME_ABBREVIATION"], year),
        axis=1,
    )
    games["VISITOR_IMG"] = games.apply(
        lambda row: create_logo_lookup(row["VISITOR_ABBREVIATION"], year),
        axis=1,
    )
    return games


def get_standings(season=None):
    standings = leaguestandingsv3.LeagueStandingsV3().get_data_frames()[0]
    standings = standings[["Conference", "ConferenceGamesBack", "WINS", "LOSSES", "L10", "ClinchIndicator", "TeamCity", "TeamName", "TeamID"]]
    standings["TeamAbbr"] = standings.apply(
        lambda row: get_team_abbreviation(row["TeamID"]), axis=1
    )
    standings["IMG"] = standings.apply(
        lambda row: create_logo_lookup(row["TeamAbbr"], season if season else 2024),
        axis=1,
    )

    print(standings)
    

    west = standings[standings["Conference"] == "West"].sort_values(by=["WINS"], ascending=[False]).to_dict(orient="records")
    east = standings[standings["Conference"] == "East"].sort_values(by=["WINS"], ascending=[False]).to_dict(orient="records")

    return {"East": east, "West": west}

def get_players_by_stats(stats, perGameFlags, season):
    print(f"Getting players by stats: {stats}, perGameFlags: {perGameFlags}, season: {season}")
    print(f"Type of stats: {type(stats)}, Type of perGameFlags: {type(perGameFlags)}, Type of season: {type(season)}")
    print(f"Length of stats: {len(stats)}, Length of perGameFlags: {len(perGameFlags)}")
    leaders = leagueleaders.LeagueLeaders(season=season).get_data_frames()[0]
    master = {}
    for idx, stat in enumerate(stats):
        print("enumerate", idx, stat, len(perGameFlags))
        perGameFlag = perGameFlags[idx]
        stat = stat.upper()
        if stat not in leaders.columns:
            return {"error": f"Stat '{stat}' not found."}
        if perGameFlag:
            cutoff = int(leaders["GP"].max() * 0.4)
            leaders = leaders[leaders["GP"] >= cutoff]
            leaders[stat + "_PG"] = (leaders[stat] / leaders["GP"]).round(1)
            stat = stat + "_PG"
        master[stat] = leaders[["PLAYER_ID", "PLAYER", "TEAM", stat]].sort_values(by=[stat], ascending=False).head(20).to_dict(orient="records")
    # sorted_leaders = leaders.sort_values(by=[stat], ascending=False)
    # sorted_leaders[stat] = sorted_leaders[stat].round(2)
    # top_players = sorted_leaders[["PLAYER_ID", "PLAYER"] + ].head(20).to_dict(orient="records")
    # return top_players
    return master