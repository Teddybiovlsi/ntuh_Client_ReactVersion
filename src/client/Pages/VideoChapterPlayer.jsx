import React, { useEffect, useState } from "react";
// import VideoJS from "../../components/VideoJS";
import { useLocation } from "react-router-dom";
import "video.js/dist/video-js.css";
import Loading from "../../components/Loading";
import "../../components/videoqa.css";
import { ChapterVideoJS } from "../../components/ChapterVideoJS";
// import { get } from "../axios";

export default function VideoChapterPlayer() {
  const location = useLocation();
  //   const VideoUUID = location.state?.videoUUID;
  const VideoPath = location.state?.videoPath;
  const VideoCurrentTime = location.state?.videoCurrentTime;
  const VideoInterruptTime = location.state?.videoInterruptTime;
  const VideoID = location.state?.videoID;

  const info = location.state?.info;

  //   console.log("VideoPath", VideoPath);
  //   console.log("VideoCurrentTime", VideoCurrentTime);
  //   console.log("VideoInterruptTime", VideoInterruptTime);
  //   console.log("info", info);

  const [loading, setLoading] = useState(false);

  const videoJsOptions = {
    controls: true,
    // autoplay: true,
    // playbackRates: [0.5, 1, 1.5, 2],
    responsive: true,
    fluid: true,
    muted: true,
    sources: [
      {
        src: VideoPath,
        type: "video/mp4",
      },
    ],
  };

  if (loading) return <Loading />;

  return (
    <>
      <ChapterVideoJS
        VideoID={VideoID}
        VideoCurrentTime={VideoCurrentTime}
        options={videoJsOptions}
        info={info}
      />
      {/* <div>測試</div> */}
    </>
  );
}
