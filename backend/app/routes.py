from flask import Blueprint, jsonify, request
import polars as pl
import pandas as pd
import psycopg2
import sqlalchemy
from backend.lib.models.player_similarity import player_similarity
from backend.lib.models.player_attributes import player_attributes
from backend.lib.models.player_shotchart import player_shotchart
from nba_api.stats.endpoints import scoreboardv2 as scoreboard
from backend.lib.models import NbaApiHelper as NbaHelper
import os
from backend.app import cache


DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
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
@cache.cached(timeout=300)  # cache for 5 minutes
def get_current_games(year, month, day):
    master_games = scoreboard.ScoreboardV2(
        game_date=f"{year}-{month}-{day}", league_id="00", day_offset=0
    )
    games = NbaHelper.master_game_table(master_games.get_data_frames(), year)
    games.fillna(0, inplace=True)
    print(games.head())
    return jsonify(games.to_dict(orient="records")), 200


@main.route("/api/get_standings/<season>")
@cache.cached(timeout=3600)  # Cache for 1 hour (3600 seconds)
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


@main.route("/api/player_info/<id>")
def player_info(id):
    player = NbaHelper.get_player_info(int(id))
    return jsonify(player), 200


@main.route('/api/playerid')
def player_id():
    name = request.args.get('name', '')
    if not name:
        return jsonify({'error': 'Missing name'}), 400

    matched = NbaHelper.get_player_id(name)
    if not matched:
        return jsonify({'player_id': None})

    return jsonify({'player_id': matched[0]['id']})


@main.route('/api/league_roster')
def league_roster():
    query = 'SELECT * FROM active_players WHERE "ROSTERSTATUS" = \'Active\''
    df = pd.read_sql(query, engine)
    roster = df.to_dict(orient='records')
    return jsonify(roster)


@main.route('/api/search_players/<name>')
def search_players(name):
    name = name.lower().strip()
    league_roster = NbaHelper.get_league_roster(engine)
    matches = [
        {
            "player_id": player["PERSON_ID"],
            "name": player["DISPLAY_FIRST_LAST"]
        }
        for player in league_roster
        if "DISPLAY_FIRST_LAST" in player and name in player["DISPLAY_FIRST_LAST"].lower()
    ]

    return jsonify(matches[:10])


