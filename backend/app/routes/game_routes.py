from flask import Blueprint, jsonify
from app.extensions import cache
import pandas as pd, os
from nba_api.stats.endpoints import scoreboardv2 as scoreboard
# from app.models.nba_api_helper import fetch_from_proxy

from app.models import nba_api_helper as NbaHelper
from app.extensions import engine


game_bp = Blueprint("game", __name__)


proxy_user = os.environ['PROXY_USER']
proxy_pass = os.environ['PROXY_PASS']
proxy_host = os.environ['PROXY_HOST']
proxy_port = os.environ['PROXY_PORT']

proxy_url = f"http://{proxy_user}:{proxy_pass}@{proxy_host}:{proxy_port}"

@game_bp.route("/api/get_current_games/<year>/<month>/<day>")
@cache.cached(timeout=86400)
def get_current_games(year, month, day):
    master_games = scoreboard.ScoreboardV2(
        game_date=f"{year}-{month}-{day}", league_id="00", day_offset=0, proxy=proxy_url
    )
    games = NbaHelper.master_game_table(master_games.get_data_frames(), year)
    games.fillna(0, inplace=True)
    return jsonify(games.to_dict(orient="records")), 200
    # params = {"GameDate": f"{year}-{month}-{day}", "LeagueID": "00", "DayOffset": 0}
    # data = fetch_from_proxy("stats/scoreboardv2", params=params)
    # master_games = NbaHelper.master_game_table(data["resultSets"], year)
    # master_games.fillna(0, inplace=True)
    # return jsonify(master_games.to_dict(orient="records")), 200

@game_bp.route("/api/get_standings/<season>")
@cache.cached(timeout=86400)
def get_standings(season):
    standings = NbaHelper.get_standings()
    return jsonify(standings), 200

@game_bp.route("/api/league_roster")
def league_roster():
    query = 'SELECT * FROM active_players WHERE "ROSTERSTATUS" = \'Active\''
    df = pd.read_sql(query, engine)
    return jsonify(df.to_dict(orient="records"))
