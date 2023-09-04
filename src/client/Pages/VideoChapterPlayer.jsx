import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../../components/Loading';
import '../../components/videoqa.css';
import { ChapterVideoJS } from '../../components/ChapterVideoJS';

export default function VideoChapterPlayer() {
  const location = useLocation();
  const VideoPath = location.state?.videoPath;
  const VideoCurrentTime = location.state?.videoCurrentTime;
  const VideoInterruptTime = location.state?.videoInterruptTime;
  const VideoID = location.state?.videoID;
  const info = location.state?.info;

  const [loading, setLoading] = useState(false);

  const videoJsOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    muted: true,
    sources: [
      {
        src: VideoPath,
        type: 'video/mp4',
      },
    ],
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ChapterVideoJS
      VideoID={VideoID}
      VideoCurrentTime={VideoCurrentTime}
      options={videoJsOptions}
      info={info}
    />
  );
}
