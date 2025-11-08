import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

VENDOR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "vendor", "nba_api", "src"))

if os.path.exists(VENDOR_PATH):
    sys.path.insert(0, VENDOR_PATH)

from app import create_app

app = create_app()

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=app.config["DEBUG"])
    print("Flask server stopped.")
