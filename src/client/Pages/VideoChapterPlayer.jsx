import React, { useEffect, useState } from "react";
import VideoJS from "../../components/VideoJS";
import { useLocation } from "react-router-dom";
import { get } from "../axios";
import "video.js/dist/video-js.css";
import Loading from "../../components/Loading";
import "../../components/videoqa.css";

export default function VideoChapterPlayer() {
  const location = useLocation();
  //   const VideoUUID = location.state?.videoUUID;
  const VideoPath = location.state?.videoPath;
  const VideoCurrentTime = location.state?.videoCurrentTime;
  const VideoInterruptTime = location.state?.videoInterruptTime;
  const info = location.state?.info;

  console.log("VideoPath", VideoPath);
  console.log("VideoCurrentTime", VideoCurrentTime);
  console.log("VideoInterruptTime", VideoInterruptTime);
  console.log("info", info);

  //   const [info, setInfo] = useState({});
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

  //   useEffect(() => {
  //     let ignore = false;
  //     if (!ignore) {
  //       async function fetchVideoData({ api }) {
  //         try {
  //           setLoading(true);
  //           const response = await get(api);
  //           const VideoInfo = await response.data.data;
  //           setInfo(VideoInfo);
  //           setLoading(false);
  //         } catch (error) {}
  //       }

  //       fetchVideoData({
  //         api: `videoQA/${VideoUUID}`,
  //       });
  //     }
  //     return () => {
  //       ignore = true;
  //     };
  //   }, []);

  if (loading) return <Loading />;

  return (
    <>
      {/* <VideoJS options={videoJsOptions} info={info} /> */}
      <div>測試</div>
    </>
  );
}
