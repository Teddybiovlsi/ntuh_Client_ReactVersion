import React, { useEffect, useState } from "react";
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
import VideoChapterPlayer from "./client/Pages/VideoChapterPlayer";
import RecordPage from "./client/Pages/RecordPage";
import UserSetting from "./client/Pages/UserSetting";
import ForgotPasswordForm from "./client/Pages/ForgotPasswordForm";
import RewritePasswordPage from "./client/Pages/RewritePasswordPage";
import RewritePasswordProtected from "./RewritePasswordProtected";
import UsingTip from "./client/Pages/UsingTip";
import BasicVideoList from "./client/Pages/BasicVideoList";
import BasicVideoPlayer from "./client/Pages/BasicVideoPlayer";
import BasicVideoQuestionPage from "./client/Pages/BasicVideoQuestionPage";
import { post } from "./client/axios";

export default function App() {
  const location = useLocation();
  const user = JSON.parse(
    localStorage?.getItem("user") || sessionStorage?.getItem("user")
  );

  useEffect(() => {
    var allCookies = document.cookie.split(";");
    for (var i = 0; i < allCookies.length; i++) {
      document.cookie =
        allCookies[i] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, [location]);

  return (
    <div className="app">
      <Header />
      <main className="app_main">
        <Routes>
          <Route index path="/" element={<LogIn />} />
          <Route path="/forgetPassword" element={<ForgotPasswordForm />} />
          <Route
            element={
              <RewritePasswordProtected
                verifyCode={location?.state?.verifyCode}
              />
            }
          >
            <Route
              path="/rewritePasswordPage"
              element={<RewritePasswordPage />}
            />
          </Route>

          <Route element={<AuthProtected user={user} />}>
            <Route path="/Home" element={<Home />} />
            <Route path="/basic" element={<BasicVideoList />} />
            <Route
              path="/pratice"
              element={<VideoList PageTitle={0} loadingText="載入中請稍後" />}
            />
            <Route
              path="/test"
              element={<VideoList PageTitle={1} loadingText="載入中請稍後" />}
            />
            <Route path="/Basicvideo" element={<BasicVideoPlayer />} />
            <Route
              path="/basic/videoQuestion"
              element={<BasicVideoQuestionPage />}
            />

            <Route path="/video" element={<VideoPlayer />} />
            <Route path="/video/chapter" element={<VideoChapterPlayer />} />
            <Route
              path="/record/pratice"
              element={<RecordPage recordType={0} />}
            />
            <Route
              path="/record/test"
              element={<RecordPage recordType={1} />}
            />
            <Route path="/usingTip" element={<UsingTip />} />
            <Route path="/comment" element={<UserComment />} />
            <Route path="/setting" element={<UserSetting />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
