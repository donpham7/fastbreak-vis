import sys, os

# Absolute path to ../vendor
VENDOR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "vendor", "nba_api", "src"))

# Put vendor at the FRONT of sys.path
sys.path.insert(0, VENDOR_PATH)

from app import create_app

app = create_app()

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=True)
    print("Flask server stopped.")
