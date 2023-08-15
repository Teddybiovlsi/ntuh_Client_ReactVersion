import React, { useEffect } from "react";
import Header from "./client/Header";
import { Route, Routes } from "react-router-dom";
import UserComment from "./client/Pages/UserComment";
import Home from "./client/Pages/Home";
import LogIn from "./client/Pages/LogIn";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import VideoList from "./client/Pages/VideoList";
import VideoPlayer from "./client/Pages/VideoPlayer";
import AuthProtected from "./AuthProtected";

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
          <Route index path="/" element={<LogIn />} />
          <Route
            element={
              <AuthProtected user={JSON.parse(localStorage?.getItem("user"))} />
            }
          >
            <Route path="/Home" element={<Home />} />
            <Route
              path="/pratice"
              element={<VideoList PageTitle={0} loadingText="載入中請稍後" />}
            />
            <Route
              path="/test"
              element={<VideoList PageTitle={1} loadingText="載入中請稍後" />}
            />
            <Route path="/video" element={<VideoPlayer />} />
            <Route path="/comment" element={<UserComment />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
