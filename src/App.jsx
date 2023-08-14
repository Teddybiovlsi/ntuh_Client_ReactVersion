import React, { useEffect } from "react";
import Header from "./client/Header";
import { Route, Routes } from "react-router-dom";
import UserComment from "./client/Pages/UserComment";
import Home from "./client/Pages/Home";
import LogIn from "./client/Pages/LogIn";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import VideoList from "./client/Pages/VideoList";

export default function App() {
  const location = useLocation();
  const user = JSON.parse(localStorage?.getItem("user"));

  useEffect(() => {
    if (user) {
      // if (new Date(user.expTime) < new Date()) {
      //   // localStorage.removeItem("user");
      // }
      // console.log("user", user);
    }
  }, [location]);

  return (
    <div className="app">
      <Header />
      <main className="app_main">
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route
            path="/pratice"
            element={<VideoList PageTitle={0} loadingText="載入中請稍後" />}
          />
          <Route
            path="/test"
            element={<VideoList PageTitle={1} loadingText="載入中請稍後" />}
          />
          <Route path="/comment" element={<UserComment />} />
          <Route path="/Login" element={<LogIn />} />
        </Routes>
      </main>
    </div>
  );
}
