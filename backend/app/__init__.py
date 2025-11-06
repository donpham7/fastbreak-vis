from flask import Flask
from flask_caching import Cache
import os
from dotenv import load_dotenv
load_dotenv()  


cache = Cache()

def create_app():
    app = Flask(__name__, static_folder="../frontend/build", static_url_path="")
    app.config.from_mapping({
        "CACHE_TYPE": "simple",
        "CACHE_DEFAULT_TIMEOUT": 300,
    })
    cache.init_app(app)

    from backend.app.routes import main
    app.register_blueprint(main)

    return app
