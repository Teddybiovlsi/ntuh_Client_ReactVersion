import React, { useEffect, useState } from "react";
import VideoJS from "../../components/VideoJS";
import { useLocation } from "react-router-dom";
import { get } from "../axios";
import "video.js/dist/video-js.css";
import Loading from "../../components/Loading";
import "../../components/videoqa.css";
import { getUserSession } from "../../js/userAction";
import { postViewCount } from "../../js/api";

export default function VideoPlayer() {
  const user = getUserSession();
  const location = useLocation();
  const { videoID, videoPath, questionData, pageTitle } = location.state || {};

  useEffect(() => {
    if (!location.state) {
      alert("請先選擇影片！");
      navigate("/");
    }
  }, [location.state]);

  if (!location.state) return null;

  const [info, setInfo] = useState({});
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
  };

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      async function fetchVideoData({ api }) {
        try {
          const response = await get(api);
          const VideoInfo = await response.data.data;
          setInfo(VideoInfo);
          setLoading(false);
        } catch (error) {}
      }

      fetchVideoData({
        api: `videoQA/${videoID}`,
      });
    }

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const permission = user.permission;
        const token = user.client_token || user.guestInfo;
        const reponse = await postViewCount(permission, token, videoID);
      } catch (error) {
        console.log(error);
        alert("影片發生錯誤，請稍後再試");
        navigate("/Home", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <VideoJS
      options={videoJsOptions}
      info={info}
      pageTitle={pageTitle}
      questionData={questionData}
      videoID={videoID}
    />
  );
}
