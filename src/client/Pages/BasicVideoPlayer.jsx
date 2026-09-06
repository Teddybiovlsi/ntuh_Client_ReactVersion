import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BasicVideoJS from "../../components/BasicVideoJS";
import LoadingComponent from "../../components/LoadingComponent";
import "video.js/dist/video-js.css";

import PageTitleHeading from "../../components/PageTitleHeading";
import "../../components/videoqa.css";
import { postViewCount, getErrorMessage } from "../../js/api";
import { Container } from "react-bootstrap";

export default function BasicVideoPlayer({ user }) {
  // 使用 React Router 的 useNavigate 鉤子來獲取 navigate 函數，用於在應用程式中導航
  const navigate = useNavigate();

  // 使用 React Router 的 useLocation 鉤子來獲取當前路由的位置資訊
  const location = useLocation();

  // 從 location.state 中解構出 info、videoPath、videoID 和 latestWatchTime，如果 location.state 為 null 或 undefined，則使用預設值
  const {
    info = {},
    videoPath = "",
    videoID = "",
    duration = 0,
    latestWatchTime = 0,
  } = location?.state || {};

  const [loading, setLoading] = useState(true);

  // 使用 useEffect 鉤子來在 location.state 為 null 或 undefined 時顯示警告並導航到首頁
  useEffect(() => {
    if (!location.state) {
      alert("請先選擇影片！");
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  const videoJsOptions = {
    controls: true,
    // autoplay: true,
    // playbackRates: [0.5, 1, 1.5, 2],
    responsive: true,
    // fluid: true,
    muted: false,
    sources: [
      {
        src: videoPath,
        type: "video/mp4",
      },
    ],
    // playsinline: true,
  };

  useEffect(() => {
    if (!location.state) return;

    const fetchData = async () => {
      try {
        const permission = user?.permission;
        const token = user?.client_token || user?.guestInfo;
        await postViewCount(permission, token, videoID);
      } catch (error) {
        alert(getErrorMessage(error, "影片發生錯誤，請稍後再試"));
        navigate("/Home", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 所有 hook 都已呼叫完畢後才做早退判斷，以符合 Hooks 規則
  if (!location.state) {
    return null;
  }

  if (loading)
    return <LoadingComponent text="載入中..." title="基礎練習用衛教資訊" />;

  return (
    <Container>
      <PageTitleHeading text="基礎練習影片觀賞" styleOptions={4} />
      <BasicVideoJS
        options={videoJsOptions}
        videoID={videoID}
        duration={duration}
        latestWatchTime={latestWatchTime}
        questionData={info}
      />
    </Container>
  );
}
