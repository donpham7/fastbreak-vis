from .player_routes import player_bp
from .game_routes import game_bp

def register_routes(app):
    app.register_blueprint(player_bp)
    app.register_blueprint(game_bp)
