import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import VideoOnlyJS from "../../components/VideoOnlyJS";
import LoadingComponent from "../../components/LoadingComponent";
import { post } from "../axios";
import "video.js/dist/video-js.css";
import "../../components/videoqa.css";

export default function VideoOnlyPlayer({ user }) {
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  if (!location.state) {
    alert("請先選擇影片！");
    return <Navigate to="/" replace />;
  }

  const { info, videoPath, videoID, latestWatchTime } = location?.state;

  const videoJsOptions = {
    controls: true,
    // autoplay: true,
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

  const fetchUploadWatchTime = async () => {
    try {
      const response = await post(
        `client/addcount/video/${user.client_token}`,
        {
          videoID: videoID,
        }
      );
      console.log("已成功上傳觀看次數");
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUploadWatchTime();
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
      <VideoOnlyJS
        options={videoJsOptions}
        videoID={videoID}
        latestWatchTime={latestWatchTime}
        questionData={info}
      />
    </>
  );
}
