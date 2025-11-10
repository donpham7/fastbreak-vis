from nba_api.stats.static import teams, players
from nba_api.stats.endpoints import leaguestandingsv3, leagueleaders, commonplayerinfo
import pandas as pd, os
from datetime import date

# from flask import current_app
# from app.extensions import cache





# import httpx, os, random, ssl, time, json

# def fetch_from_proxy(path, params, max_retries=3, cache_timeout=None):
#     cache_key = f"{path}:{json.dumps(params, sort_keys=True)}"
#     cached = cache.get(cache_key)
#     if cached:
#         print("DEBUG: Returning cached response for", path)
#         return cached

#     if cache_timeout is None:
#         cache_timeout = current_app.config.get("CACHE_DEFAULT_TIMEOUT", 300)
    
#     # Build proxy credentials
#     sessid = random.randint(10000, 99999)
#     proxy_user = f"{os.environ['PROXY_USER']}-sessid-{sessid}"
#     proxy_pass = os.environ['PROXY_PASS']
#     proxy_host = os.environ['PROXY_HOST']
#     proxy_port = os.environ['PROXY_PORT']

#     proxy_url = f"http://{proxy_user}:{proxy_pass}@{proxy_host}:{proxy_port}"

#     # Construct full URL if only a path is passed
#     if not path.startswith("http"):
#         url = f"https://stats.nba.com/{path.lstrip('/')}"
#     else:
#         url = path

#     headers = {
#         "Host": "stats.nba.com",
#         "Connection": "keep-alive",
#         "Accept": "application/json, text/plain, */*",
#         "User-Agent": (
#             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
#             "AppleWebKit/537.36 (KHTML, like Gecko) "
#             "Chrome/120.0.0.0 Safari/537.36"
#         ),
#         "Origin": "https://www.nba.com",
#         "Referer": "https://www.nba.com/",
#         "Accept-Encoding": "gzip, deflate, br",  # matches curl --compressed
#         "TE": "trailers"
#     }
#     ssl_context = ssl.create_default_context()
#     ssl_context.set_ciphers("DEFAULT:@SECLEVEL=1")

#     # transport = httpx.HTTPTransport(http1=True, http2=False, ssl_context=ssl_context)
#     timeout = httpx.Timeout(connect=10.0, read=120.0, write=10.0, pool=10.0)

#     for attempt in range(1, max_retries + 1):
#         try:
#             with httpx.Client(
#                 proxy=proxy_url,
#                 headers=headers,
#                 timeout=timeout,
#                 http1=True,
#                 http2=False,
#                 verify=ssl_context,
#                 limits=httpx.Limits(max_keepalive_connections=0)
#             ) as client:
#                 resp = client.get(url, params=params)

#                 # 🔎 Debug logging
#                 print("DEBUG: Final URL:", resp.request.url)
#                 print("DEBUG: Sent headers:", resp.request.headers)
#                 print("DEBUG: Status code:", resp.status_code)
#                 print("DEBUG: First 500 chars of body:\n", resp.text[:500])

#                 resp.raise_for_status()
#                 data = resp.json()
#                 cache.set(cache_key, data, timeout=cache_timeout)
#                 return data

#         except Exception as e:
#             print(f"⚠️ Attempt {attempt} failed with error: {type(e).__name__}: {e}")
#             if attempt < max_retries:
#                 time.sleep(5)
#             else:
#                 raise



proxy_user = os.environ['PROXY_USER']
proxy_pass = os.environ['PROXY_PASS']
proxy_host = os.environ['PROXY_HOST']
proxy_port = os.environ['PROXY_PORT']

proxy_url = f"http://{proxy_user}:{proxy_pass}@{proxy_host}:{proxy_port}"




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


def get_player_info(player_id):
    info = commonplayerinfo.CommonPlayerInfo(player_id=player_id, proxy=proxy_url)
    result_set = info.get_dict()['resultSets'][0]
    # data = fetch_from_proxy("stats/commonplayerinfo", params={"PlayerID": player_id})
    # result_set = data["resultSets"][0]

    if not result_set:
        return None
    headers = result_set['headers']
    values = result_set['rowSet'][0]
    player_info = dict(zip(headers, values))

    return player_info

def get_player_id(player_name):
    return players.find_players_by_full_name(player_name)


def get_team_abbreviation(team_id):
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
    # standings = leaguestandingsv3.LeagueStandingsV3().get_data_frames()[0]

    # data = fetch_from_proxy(
    #     "stats/leaguestandingsv3",
    #     params={
    #         "LeagueID": "00",
    #         "Season": "2024-25",
    #         "SeasonType": "Regular Season",
    #     }
    # )
    # standings = pd.DataFrame(data["resultSets"][0]["rowSet"], columns=data["resultSets"][0]["headers"])

    season = get_current_season()
    standings_endpoint = leaguestandingsv3.LeagueStandingsV3(
            season=season if season else "2024-25",
            league_id="00",
            proxy=proxy_url
        )

    # Get the first DataFrame (the standings table)
    standings = standings_endpoint.get_data_frames()[0]
    
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
    # leaders = leagueleaders.LeagueLeaders(season=season).get_data_frames()[0]

    # data = fetch_from_proxy("stats/leagueleaders", params={"Season": season})
    # leaders = pd.DataFrame(data["resultSets"][0]["rowSet"], columns=data["resultSets"][0]["headers"])
    season = get_current_season()

    leaders_endpoint = leagueleaders.LeagueLeaders(
        season=season,
        league_id="00",
        stat_category_abbreviation="PTS",  # default category, but DataFrame includes all stats
        proxy=proxy_url
    )

    # Get the DataFrame
    leaders = leaders_endpoint.get_data_frames()[0]

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


def get_league_roster(engine):
    query = 'SELECT "PERSON_ID", "DISPLAY_FIRST_LAST" FROM active_players WHERE "ROSTERSTATUS" = \'Active\''
    df = pd.read_sql(query, engine)
    return df.to_dict(orient='records')


def get_current_season():
    today = date.today()
    year = today.year
    month = today.month

    # NBA season starts in October
    if month >= 10:  
        return f"{year}-{str(year+1)[-2:]}"
    else:
        return f"{year-1}-{str(year)[-2:]}"