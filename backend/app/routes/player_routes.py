from flask import Blueprint, jsonify, request
import pandas as pd
from app.models.player_similarity import player_similarity
from app.models.player_attributes import player_attributes
from app.models.player_shotchart import player_shotchart
from app.models import nba_api_helper as NbaHelper
from app.extensions import engine


player_bp = Blueprint("player", __name__)

@player_bp.route("/api/player_similarities/<season>/<player_id>")
def player_similarities(season, player_id):
    res = player_similarity(player_id, season, engine)
    return jsonify({"season": res[0]["season"][0], "player_name": res[0]["player"][0]})

@player_bp.route("/api/player_comparison/<season>/<player>")
def mirror_bar_chart(season, player):
    query = """SELECT * FROM per_36_minutes WHERE player = %s AND season = %s"""
    player_df = pd.read_sql(query, engine, params=(player, season))
    if player_df.empty:
        return jsonify({"error": f"No data found for {player} in {season}"}), 404
    return jsonify(player_df.to_dict(orient="records")[0]), 200

@player_bp.route("/api/player_attributes/<season>/<player>/<scope>")
def radar_chart(season, player, scope):
    player_df = player_attributes(player, season, scope, engine)
    if player_df.is_empty():
        return jsonify({"error": f"No data found for {player} in {season}"}), 404
    return jsonify(player_df.to_dicts()), 200

@player_bp.route("/api/player_shotchart/<player>")
def shot_chart(player):
    player_df = player_shotchart(player, engine)
    if player_df.is_empty():
        return jsonify({"error": f"No data found for {player}"}), 404
    return jsonify(player_df.to_dicts()), 200

@player_bp.route("/api/player_info/<id>")
def player_info(id):
    return jsonify(NbaHelper.get_player_info(int(id))), 200

@player_bp.route("/api/playerid")
def player_id():
    name = request.args.get("name", "")
    if not name:
        return jsonify({"error": "Missing name"}), 400
    matched = NbaHelper.get_player_id(name)
    return jsonify({"player_id": matched[0]["id"] if matched else None})

@player_bp.route("/api/search_players/<name>")
def search_players(name):
    name = name.lower().strip()
    league_roster = NbaHelper.get_league_roster(engine)
    matches = [
        {"player_id": p["PERSON_ID"], "name": p["DISPLAY_FIRST_LAST"]}
        for p in league_roster
        if "DISPLAY_FIRST_LAST" in p and name in p["DISPLAY_FIRST_LAST"].lower()
    ]
    return jsonify(matches[:10])

@player_bp.route("/api/players_by_stats", methods=["POST"])
def players_by_stats():
    data = request.get_json()
    stats = data.get("stats", ["PTS"])
    perGameFlags = data.get("perGameFlags", [True])
    seasons = data.get("season", "2024-25")
    players = NbaHelper.get_players_by_stats(stats, perGameFlags, seasons)
    return jsonify(players), 200