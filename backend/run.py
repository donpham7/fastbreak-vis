import sys, os
from flask import Flask, send_from_directory

# Absolute path to ../vendor
VENDOR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "vendor", "nba_api", "src"))
sys.path.insert(0, VENDOR_PATH)

def create_app():
    app = Flask(__name__, static_folder="../frontend/build", static_url_path="")

    # Register your blueprint
    from backend.app.routes import main
    app.register_blueprint(main)

    # Serve React build
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, "index.html")

    return app

app = create_app()

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=True)   # local dev only
    print("Flask server stopped.")
