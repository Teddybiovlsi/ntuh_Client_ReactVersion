import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import BasicVideoJS from "../../components/BasicVideoJS";
import LoadingComponent from "../../components/LoadingComponent";
import { post } from "../axios";
import "video.js/dist/video-js.css";
import "../../components/videoqa.css";
import { getUserSession } from "../../js/userAction";

export default function BasicVideoPlayer() {
  const user = getUserSession();
  // 使用 React Router 的 useNavigate 鉤子來獲取 navigate 函數，用於在應用程式中導航
  const navigate = useNavigate();

  // 使用 React Router 的 useLocation 鉤子來獲取當前路由的位置資訊
  const location = useLocation();

  // 從 location.state 中解構出 info、videoPath、videoID 和 latestWatchTime，如果 location.state 為 null 或 undefined，則使用預設值
  const {
    info = {},
    videoPath = "",
    videoID = "",
    latestWatchTime = 0,
  } = location?.state || {};

  // 使用 useEffect 鉤子來在 location.state 為 null 或 undefined 時顯示警告並導航到首頁
  useEffect(() => {
    if (!location.state) {
      alert("請先選擇影片！");
      navigate("/");
    }
  }, [location.state]);

  // 如果 location.state 為 null 或 undefined，則不渲染任何內容
  if (!location.state) {
    return null;
  }

  const [loading, setLoading] = useState(true);

  const videoJsOptions = {
    controls: true,
    // autoplay: true,
    // playbackRates: [0.5, 1, 1.5, 2],
    responsive: true,
    fluid: true,
    muted: true,
    sources: [
      {
        src: videoPath,
        type: "video/mp4",
      },
    ],

    playsinline: true,
  };

  /**
   * 透過 `axios` 套件，向後端發送上傳觀看次數請求。
   *
   * @param {string} permission - 使用者權限。
   * @param {string} token - 使用者權杖。
   * @returns {void} 這個函數不返回任何值，因為它只是發送一個請求並處理結果。
   * @async
   * @function fetchUploadWatchTime
   */
  const fetchUploadWatchTime = async (permission, token) => {
    try {
      const url =
        permission === "ylhClient"
          ? `client/addcount/video/${token}`
          : `guest/view/video/${token}`;
      const response = await post(url, { videoID: videoID });
      console.log("已成功上傳觀看次數");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const permission = user.permission;
        const token = user.client_token || user.guestInfo;
        await fetchUploadWatchTime(permission, token);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <LoadingComponent text="載入中..." title="基礎練習用衛教資訊" />;

  return (
    <>
      <BasicVideoJS
        options={videoJsOptions}
        videoID={videoID}
        latestWatchTime={latestWatchTime}
        questionData={info}
      />
    </>
  );
}
