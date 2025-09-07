from flask import Blueprint, jsonify, request
import polars as pl
import pandas as pd
import psycopg2
import sqlalchemy
from lib.models.player_similarity import player_similarity
from lib.models.player_attributes import player_attributes
from lib.models.player_shotchart import player_shotchart
from nba_api.stats.endpoints import scoreboardv2 as scoreboard
from lib import NbaApiHelper as NbaHelper
from google import genai

DATABASE_URL = "postgresql://u7btk4p5c5m73u:p8d8ff8ddeaabbc4fa6652587c63a9944594a63a232b3eba87c457007b20de8c6@cc6sr55p5nfmlu.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d6jnenvoupkq12"
GEMINI_API_KEY = "AIzaSyDAtOO9m0zixcFdtnAk6ZAJ1pP-Dz91J2A"
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


@main.route("/api/get_standings/<season>")
def get_standings(season):
    print(f"Getting standings for season: {season}")
    standings = NbaHelper.get_standings()
    return jsonify(standings), 200


@main.route("/api/players_by_stats", methods=["POST"])
def players_by_stats():
    data = request.get_json()
    stats = data.get("stats", ["PTS"])
    perGameFlags = data.get("perGameFlags", [True])
    seasons = data.get("season", "2024-25")
    players = NbaHelper.get_players_by_stats(stats, perGameFlags, seasons)
    return jsonify(players), 200


@main.route("/api/user_query/bar_chart", methods=["POST"])
def user_query_bar_chart():
    data = request.get_json()
    query = data.get("query", "")

    context = f"""You are an expert in SQL and PostgreSQL. You have access to a PostgreSQL database with the following tables and their columns:
        - player_per_game: 
            - Columns:
            season        integer,
            lg            text,
            player        text,
            player_id     text,
            age           integer,
            team          text,
            pos           text,
            g             integer,
            gs            integer,
            mp_per_game   double precision,
            fg_per_game   double precision,
            fga_per_game  double precision,
            fg_percent    double precision,
            x3p_per_game  double precision,
            x3pa_per_game double precision,
            x3p_percent   double precision,
            x2p_per_game  double precision,
            x2pa_per_game double precision,
            x2p_percent   double precision,
            e_fg_percent  double precision,
            ft_per_game   double precision,
            fta_per_game  double precision,
            ft_percent    text,
            orb_per_game  double precision,
            drb_per_game  double precision,
            trb_per_game  double precision,
            ast_per_game  double precision,
            stl_per_game  double precision,
            blk_per_game  double precision,
            tov_per_game  double precision,
            pf_per_game   double precision,
            pts_per_game  double precision,
            
            END OF COLUMNS

            The user wants to create a bar chart based on the following query: {query}.

            Respond with a json with the following format that will be received by python:
            {{
                "query": [generated SQL query],
                "x_label": [x axis label],
                "y_label": [y axis label],
            }}

            IMPORTANT: RESPONSE MUST BE JSON FORMAT AND RECEIVED BY PYTHON. QUERY MUST BE VALID SQL.

"""
    client = genai.Client(api_key=GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=context
    )
    print("Gemini Response:", response)
    return response
