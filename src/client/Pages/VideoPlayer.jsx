import React, { useEffect, useState } from "react";
import VideoJS from "../../components/VideoJS";
import { useLocation, useNavigate } from "react-router-dom";
import { get } from "../axios";
import "video.js/dist/video-js.css";
import Loading from "../../components/Loading";
import "../../components/videoqa.css";
import { getUserSession } from "../../js/userAction";
import { postViewCount, getErrorMessage } from "../../js/api";

export default function VideoPlayer() {
  const user = getUserSession();
  const location = useLocation();
  const navigate = useNavigate();
  const { videoID, videoPath, questionData, pageTitle, examType } =
    location.state || {};

  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const videoJsOptions = {
    controls: true,
    // autoplay: true,
    // playbackRates: [0.5, 1, 1.5, 2],
    responsive: true,
    fluid: true,
    muted: false,
    sources: [
      {
        src: videoPath,
        type: "video/mp4",
      },
    ],
  };

  useEffect(() => {
    if (!location.state) {
      alert("請先選擇影片！");
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (!location.state) return;

    let ignore = false;

    async function fetchVideoData({ api }) {
      try {
        const response = await get(api);
        const VideoInfo = response.data.data;
        if (!ignore) {
          setInfo(VideoInfo);
        }
      } catch (error) {
        if (!ignore) {
          alert(getErrorMessage(error, "無法取得影片資料，請稍後再試"));
          navigate("/Home", { replace: true });
        }
      } finally {
        // 無論成功或失敗都要解除載入狀態，避免畫面永遠卡在轉圈
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchVideoData({
      api: `videoQA/${videoID}`,
    });

    return () => {
      ignore = true;
    };
  }, []);

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
      }
    };

    fetchData();
  }, []);

  // 所有 hook 都已呼叫完畢後才做早退判斷，以符合 Hooks 規則
  if (!location.state) return null;

  if (loading) return <Loading />;

  return (
    <VideoJS
      options={videoJsOptions}
      info={info}
      pageTitle={pageTitle}
      questionData={questionData}
      videoID={videoID}
      examType={examType}
    />
  );
}
