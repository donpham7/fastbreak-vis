from flask import Blueprint, jsonify
import polars as pl
import pandas as pd
import psycopg2
import sqlalchemy
from lib.models.player_similarity import player_similarity
from lib.models.player_attributes import player_attributes
from lib.models.player_shotchart import player_shotchart
from nba_api.stats.endpoints import scoreboardv2 as scoreboard
from lib import NbaApiHelper as NbaHelper

DATABASE_URL = "postgresql://u7btk4p5c5m73u:p8d8ff8ddeaabbc4fa6652587c63a9944594a63a232b3eba87c457007b20de8c6@cc6sr55p5nfmlu.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d6jnenvoupkq12"

main = Blueprint("main", __name__)
engine = sqlalchemy.create_engine(DATABASE_URL)


@main.route("/api/player_similarities/<season>/<player_id>")
def player_similarities(season, player_id):
    res = player_similarity(player_id, season, engine)
    print({"season": res[0]["season"][0], "player_name": res[0]["player"][0]})
    return jsonify({"season": res[0]["season"][0], "player_name": res[0]["player"][0]})


@main.route("/api/player_comparison/<season>/<player>")
def mirror_bar_chart(season, player):
    query = """SELECT * FROM per_36_minutes WHERE player = %s AND season = %s"""
    player_df = pd.read_sql(query, engine, params=(player, season))
    if player_df.empty:
        return (
            jsonify(
                {"error": f"No data found for player '{player}' in season '{season}'"}
            ),
            404,
        )
    res = player_df.to_dict(orient="records")[0]
    return jsonify(res), 200


@main.route("/api/player_attributes/<season>/<player>/<scope>")
def radar_chart(season, player, scope):
    player_df = player_attributes(player, season, scope, engine)
    if player_df.is_empty():
        return (
            jsonify(
                {"error": f"No data found for player '{player}' in season '{season}'"}
            ),
            404,
        )
    res = player_df.to_dicts()
    return jsonify(res), 200


@main.route("/api/player_shotchart/<player>")
def shot_chart(player):
    player_df = player_shotchart(player, engine)
    if player_df.is_empty():
        return jsonify({"error": f"No data found for player '{player}'"}), 404
    res = player_df.to_dicts()
    return jsonify(res), 200


@main.route("/api/get_current_games/<year>/<month>/<day>")
def get_current_games(year, month, day):
    master_games = scoreboard.ScoreboardV2(
        game_date=f"{year}-{month}-{day}", league_id="00", day_offset=0
    )
    games = NbaHelper.master_game_table(master_games.get_data_frames(), year)
    print(games.head())
    return jsonify(games.to_dict(orient="records")), 200
