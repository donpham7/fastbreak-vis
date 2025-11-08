# app/__init__.py
import os
from flask import Flask
from flask_caching import Cache
from .config import Config
from .extensions import cache
from .routes import register_routes

# cache = Cache()

def create_app():
    # Point to React build folder
    static_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "build")

    app = Flask(__name__, static_folder=static_dir, static_url_path="")
    app.config.from_object(Config)

    # Initialize cache
    cache.init_app(app)

    # Register all blueprints
    register_routes(app)

    # Serve React frontend
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path):
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return app.send_static_file(path)
        return app.send_static_file("index.html")

    return app
