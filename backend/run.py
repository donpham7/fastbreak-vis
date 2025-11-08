import os
import sys

# Optional: vendor path hack (remove if you install nba_api via pip)
VENDOR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "vendor", "nba_api", "src"))
print("Vendor path:", VENDOR_PATH)


if os.path.exists(VENDOR_PATH):
    sys.path.insert(0, VENDOR_PATH)
print("sys.path[0:5]:", sys.path[0:5])

from app import create_app

app = create_app()

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=app.config["DEBUG"])
    print("Flask server stopped.")
