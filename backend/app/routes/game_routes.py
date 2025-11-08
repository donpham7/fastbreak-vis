from flask import Blueprint, jsonify
from app.extensions import cache
import pandas as pd
from nba_api.stats.endpoints import scoreboardv2 as scoreboard
from app.models import nba_api_helper as NbaHelper
from app.config import engine

game_bp = Blueprint("game", __name__)

@game_bp.route("/api/get_current_games/<year>/<month>/<day>")
# @cache.cached(timeout=300)
def get_current_games(year, month, day):
    master_games = scoreboard.ScoreboardV2(
        game_date=f"{year}-{month}-{day}", league_id="00", day_offset=0
    )
    games = NbaHelper.master_game_table(master_games.get_data_frames(), year)
    games.fillna(0, inplace=True)
    return jsonify(games.to_dict(orient="records")), 200

@game_bp.route("/api/get_standings/<season>")
def get_standings(season):
    standings = NbaHelper.get_standings()
    return jsonify(standings), 200

@game_bp.route("/api/league_roster")
def league_roster():
    query = 'SELECT * FROM active_players WHERE "ROSTERSTATUS" = \'Active\''
    df = pd.read_sql(query, engine)
    return jsonify(df.to_dict(orient="records"))
