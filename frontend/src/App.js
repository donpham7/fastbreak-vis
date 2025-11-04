import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Player from "./pages/components/Player";
import Players from "./pages/Players";

function App() {
    return (
        <div className="bg-surface min-h-screen">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/player/:id" element={<Player />} />
                    <Route path="/players" element={<Players />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
