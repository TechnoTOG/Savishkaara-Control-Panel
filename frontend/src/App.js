import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import UpdatePassword from "./pages/updatePassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
