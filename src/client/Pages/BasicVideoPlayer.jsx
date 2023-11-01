import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import BasicVideoJS from "../../components/BasicVideoJS";
import "video.js/dist/video-js.css";
import "../../components/videoqa.css";

export default function BasicVideoPlayer() {
  const location = useLocation();

  if (!location.state) {
    alert("請先選擇影片！");
    return <Navigate to="/" replace />;
  }

  const { videoPath, videoID, latestWatchTime } = location?.state;

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

  return (
    <>
      <BasicVideoJS
        options={videoJsOptions}
        videoID={videoID}
        latestWatchTime={latestWatchTime}
      />
    </>
  );
}
