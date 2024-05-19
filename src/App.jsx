import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Personal from "./Personal";
import Work from "./Work";

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personal" element={<Personal />} />
        <Route path="/work" element={<Work />} />
      </Routes>
    </Router>
  );
}

export default Main;
