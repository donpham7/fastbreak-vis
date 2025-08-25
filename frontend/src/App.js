// import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import "bulma/css/bulma.min.css";

// Components or Pages
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
    return (
        <div className="bg-surface min-h-screen">
            <Router>
                {/* <nav className="p-4 bg-white flex justify-center space-x-8 border-b border-gray-300">
                    <Link to="/" className="text-black hover:underline">
                        Home
                    </Link>
                    <Link to="/about" className="text-black hover:underline">
                        About
                    </Link>
                </nav> */}

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
