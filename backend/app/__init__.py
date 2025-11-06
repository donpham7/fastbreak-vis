from flask import Flask
from flask_caching import Cache
import os
from dotenv import load_dotenv
load_dotenv()  


cache = Cache()

def create_app():
    static_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "build")
    app = Flask(__name__, static_folder=static_dir, static_url_path="")
    app.config.from_mapping({
        "CACHE_TYPE": "simple",
        "CACHE_DEFAULT_TIMEOUT": 300,
    })
    cache.init_app(app)

    from backend.app.routes import main
    app.register_blueprint(main)

        # Serve React build
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return app.send_static_file(path)
        else:
            return app.send_static_file("index.html")
        
    return app
