import React from "react";
import Header from "./client/Header";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import UserComment from "./client/Pages/UserComment";
import Home from "./client/Pages/Home";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="app_main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comment" element={<UserComment />} />
        </Routes>
      </main>
    </div>
  );
}
