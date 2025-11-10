# app/__init__.py
import os
from flask import Flask, send_from_directory
from flask_caching import Cache
from .config import Config
from .extensions import cache
from .routes import register_routes

# cache = Cache()
 
def create_app():
    # Point to React build folder
    static_dir = os.path.join(os.path.dirname(__file__), "../frontend/build")

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
        # If the requested file exists in build/, serve it
        file_path = os.path.join(app.static_folder, path)
        if path != "" and os.path.exists(file_path):
            return send_from_directory(app.static_folder, path)
        # Otherwise, serve index.html so React Router can handle the route
        return send_from_directory(app.static_folder, "index.html")

    return app
