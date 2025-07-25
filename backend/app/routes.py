from flask import Blueprint, jsonify
import polars as pl
import pandas as pd
import psycopg2
import sqlalchemy
from lib.models.player_similarity import player_similarity
from lib.models.player_attributes import player_attributes


DATABASE_URL = "postgresql://u7btk4p5c5m73u:p8d8ff8ddeaabbc4fa6652587c63a9944594a63a232b3eba87c457007b20de8c6@cc6sr55p5nfmlu.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d6jnenvoupkq12"

main = Blueprint("main", __name__)
engine = sqlalchemy.create_engine(DATABASE_URL)


@main.route("/api/hello")
def hello():
    # SQL query
    query = """SELECT * FROM player_per_game WHERE player_id = 'adebaba01' """

    # Read into pandas DataFrame
    df = pd.read_sql(query, engine)

    out = df.to_dict()
    print(df.head())
    return jsonify(out)


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
        return jsonify({"error": f"No data found for player '{player}' in season '{season}'"}), 404
    res = player_df.to_dict(orient='records')[0]
    return jsonify(res), 200

@main.route("/api/player_attributes/<season>/<player>")
def radar_chart(season, player):
    player_df = player_attributes(player, season, engine)
    if player_df.is_empty():
        return jsonify({"error": f"No data found for player '{player}' in season '{season}'"}), 404
    res = player_df.to_dicts()
    return jsonify(res), 200
