// import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import 'bulma/css/bulma.min.css';

// Components or Pages
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  return (
    <div className="has-background-white">
      <Router>
        <nav className="p-4 bg-gray-200">
          <Link to="/" className="mr-4">
            Home
          </Link>
          <Link to="/about">About</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
