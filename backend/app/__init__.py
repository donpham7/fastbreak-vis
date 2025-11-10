# app/__init__.py
import os, sys

#This must be before all other imports
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

VENDOR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "vendor", "nba_api", "src"))

if os.path.exists(VENDOR_PATH):
    sys.path.insert(0, VENDOR_PATH)

from flask import Flask, send_from_directory
from .config import Config
from .extensions import cache
from .routes.game_routes import game_bp
from .routes.player_routes import player_bp

 
def create_app():


    # Point to React build folder
    static_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "frontend",
        "build",
        "static"
    )

    app = Flask(__name__, static_folder=static_dir, static_url_path="/static")
    app.config.from_object(Config)

    # Initialize cache
    cache.init_app(app)

    # Register blueprints
    app.register_blueprint(game_bp, url_prefix="/api/games")
    app.register_blueprint(player_bp, url_prefix="/api/players")
    print("Static folder:", app.static_folder)

    build_root = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "frontend",
        "build"
    )

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path):
        file_path = os.path.join(build_root, path)
        if path and os.path.exists(file_path):
            return send_from_directory(build_root, path)
        return send_from_directory(build_root, "index.html")

    return app
