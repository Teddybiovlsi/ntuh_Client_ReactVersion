import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./client/Header";
import UserComment from "./client/Pages/UserComment";
import Home from "./client/Pages/Home";
import LogIn from "./client/Pages/LogIn";
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
import VideoOnlyPlayer from "./client/Pages/VideoOnlyPlayer";
// import BasicRecordPage from "./client/Pages/BasicRecordPage";
import BasicRecordListPage from "./client/Pages/BasicRecordListPage";
import BasicRecordDetailPage from "./client/Pages/record/BasicRecordDetailPage";
import { getUserSession } from "./js/userAction";
import PermissionProtected from "./PermissionProtected";

export default function App() {
  const location = useLocation();

  const user = getUserSession();

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
            <Route path="/Home" element={<Home user={user} />} />
            <Route path="/basic" element={<BasicVideoList user={user} />} />
            <Route
              path="/pratice"
              element={
                <VideoList
                  PageTitle={0}
                  loadingText="載入中請稍後"
                  user={user}
                />
              }
            />
            <Route
              path="/test"
              element={
                <VideoList
                  PageTitle={1}
                  loadingText="載入中請稍後"
                  user={user}
                />
              }
            />
            {/* 僅觀看影片（基礎練習用） */}
            <Route
              path="/Basicvideo"
              element={<BasicVideoPlayer user={user} />}
            />
            {/* 基礎練習測驗視窗 */}
            <Route
              path="/basic/videoQuestion"
              element={<BasicVideoQuestionPage user={user} />}
            />
            {/* 僅觀看影片(練習／測驗用) */}
            <Route
              path="/video/only"
              element={<VideoOnlyPlayer user={user} />}
            />
            {/* 有包含問題在內(練習／測驗用) */}
            <Route path="/video" element={<VideoPlayer />} />
            {/* 有包含問題影片章節選擇（練習／測驗用） */}
            <Route path="/video/chapter" element={<VideoChapterPlayer />} />

            <Route path="/usingTip" element={<UsingTip user={user} />} />
            <Route path="/comment" element={<UserComment />} />

            <Route
              element={
                <PermissionProtected
                  permission={user?.permission}
                  redirectPath="/Home"
                />
              }
            >
              <Route
                path="/record/basic"
                element={<BasicRecordListPage user={user} />}
              />

              <Route
                path="/record/basic/:videoName"
                element={<BasicRecordDetailPage />}
              />

              <Route
                path="/record/pratice"
                element={<RecordPage user={user} recordType={0} />}
              />

              <Route
                path="/record/test"
                element={<RecordPage user={user} recordType={1} />}
              />

              <Route path="/setting" element={<UserSetting user={user} />} />
            </Route>
          </Route>
        </Routes>
      </main>
    </div>
  );
}
