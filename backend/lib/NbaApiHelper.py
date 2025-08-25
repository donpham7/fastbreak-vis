from nba_api.stats.static import teams

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
