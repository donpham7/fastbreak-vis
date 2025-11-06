import sys, os
from backend.app import create_app  

VENDOR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "vendor", "nba_api", "src"))
sys.path.insert(0, VENDOR_PATH)

app = create_app()

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=True)
    print("Flask server stopped.")
