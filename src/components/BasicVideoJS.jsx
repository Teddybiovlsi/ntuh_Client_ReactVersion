import { useState, useEffect, useRef } from "react";
import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./videoqa.css";
import { post } from "../client/axios";

export const BasicVideoJS = (props) => {
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user")
  );

  const { videoID, latestWatchTime } = props;

  document.cookie = `videoID=${videoID}`;

  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(null);
  const playerRef = useRef(null);
  const { options } = props;

  const [sendstate, setSendstate] = useState(false);
  const [optionChecked, setOptionChecked] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [haveWatchedTime, setHaveWatchedTime] = useState(0);

  const [pastCurrentTime, setPastCurrentTime] = useState(latestWatchTime);

  const isIphoneCheck = navigator.userAgent.match(/iPhone/i);

  // calculate the total length of the array
  let arrayNum = 0;
  // create an async function to post the data to the backend
  const uploadTheCurrentTime = (currentTime) => {
    console.log("pastCurrentTime", pastCurrentTime);
    console.log("currentTime", currentTime);
    console.log("durationTime", currentTime - pastCurrentTime);

    setPastCurrentTime(currentTime);

    // document.cookie = `video${videoID}=${currentTime}${
    //   currentTime - pastCurrentTime
    // }`;

    // add the duration time to the cookie
    document.cookie = `videoCurrentTime=${currentTime}`;
    document.cookie = `videoDurationTime=${currentTime - pastCurrentTime}`;

    if (currentTime) {
      fetchVideoWatchTime({
        api: `client/updateTime/video/${user.client_token}`,
        data: {
          videoID: videoID,
          watchTime: currentTime,
          durationTime: currentTime - pastCurrentTime,
        },
      });
      // console.log(currentTime);
    } else {
      // get the current time of the video from the cookie
      const currentVideoTime = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`video${videoID}`))
        .split("=")[1];

      console.log("currentVideoTime", currentVideoTime);

      // fetchVideoWatchTime({
      //   api: `client/updateTime/video/${user.client_token}`,
      //   data: {
      //     videoID: videoID,
      //     watchTime: currentVideoTime,
      //     durationTime: currentVideoTime - pastCurrentTime,
      //   },
      // });
    }
  };

  const fetchVideoWatchTime = async ({ api, data }) => {
    try {
      // Get data from the API
      const response = await post(api, data);

      console.log(response.data.message);
    } catch (error) {
      const errorMessage = error.response.data.message;
      console.log(errorMessage);
    }
  };

  const toggleFullScreen = () => {
    const videoElement = document.getElementById("video-container");
    if (document.fullscreenElement) {
      // if fullscreen mode is active, exit by calling fullscreen API
      // 第一步驟，將icon轉換成進入全螢幕的icon，透過classList的replace方法
      // replace("要被替換的className", "替換後的className")
      document
        .getElementById("fullscreenBtn")
        .classList.replace(
          "vjs-icon-fullscreen-exit",
          "vjs-icon-fullscreen-enter"
        );

      document
        .getElementById("video-container_Container_player")
        .classList.remove("fullscreen");
      // // if yes, exit fullscreen mode
      document.exitFullscreen();

      setIsFullscreen(false);
    } else {
      // 若fullscreen mode不是active，則進入fullscreen mode
      // 第一步驟，將icon轉換成離開全螢幕的icon，透過classList的replace方法
      // replace("要被替換的className", "替換後的className")
      document
        .getElementById("fullscreenBtn")
        .classList.replace(
          "vjs-icon-fullscreen-enter",
          "vjs-icon-fullscreen-exit"
        );
      // add fullscreen className to the videoPlayer className
      document
        .getElementById("video-container_Container_player")
        .classList.add("fullscreen");

      // if the device is iPhone, then block the fullscreen mode
      if (navigator.userAgent.match(/iPhone/i)) {
      } else {
        setIsFullscreen(true);
        // 依據不同的瀏覽器，進入全螢幕的方法不同
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen();
        } else if (videoElement.mozRequestFullScreen) {
          videoElement.mozRequestFullScreen();
        } else if (videoElement.webkitRequestFullscreen) {
          videoElement.webkitRequestFullscreen();
        } else if (videoElement.msRequestFullscreen) {
          videoElement.msRequestFullscreen();
        } else {
          console.log("fullscreen error");
        }
      }
    }
  };

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      let isPaused = false;

      let intervalUpload = null;

      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      // if screen size is smaller than 768px, then add fullscreen button
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
      }));

      player.currentTime(latestWatchTime);

      // addChild("componentName", {componentProps}, componentIndex)
      // 其中componentIndex為可選參數，若不指定則預設為0，代表在controlBar的第一個位置
      if (!isIphoneCheck) {
        var fullScreenBtn = player.controlBar.addChild(
          "button",
          {
            clickHandler: function (event) {
              toggleFullScreen();
            },
          },
          19
        );
        var fullScreenBtnDom = fullScreenBtn.el();
        fullScreenBtnDom.innerHTML = `<span class="vjs-icon-fullscreen-enter" id="fullscreenBtn"></span>`;
        fullScreenBtnDom.title = "fullscreen";
      }

      player.on("waiting", () => {
        console.log("player is waiting");
      });
      player.on("pause", () => {
        console.log("player is paused");
        clearInterval(intervalUpload);
      });

      player.on("play", () => {
        // add the current playing time to the cookie after 5 intervals
        intervalUpload = setInterval(() => {
          uploadTheCurrentTime(player.currentTime());
        }, 5000);
      });

      // Add event listener for loadedmetadata
      player.on("loadedmetadata", () => {
        const video = player;
        if (video.videoHeight() > video.videoWidth()) {
          player.aspectRatio("16:7");
        } else {
          player.fluid(true);
        }
      });

      player.on("ended", () => {
        console.log("player is ended");
      });

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  document.addEventListener("fullscreenchange", exitHandler);
  document.addEventListener("webkitfullscreenchange", exitHandler);
  document.addEventListener("mozfullscreenchange", exitHandler);
  document.addEventListener("MSFullscreenChange", exitHandler);
  // 離開全螢幕時，將icon轉換成進入全螢幕的icon，透過classList的replace方法
  function exitHandler() {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      document
        .getElementById("fullscreenBtn")
        .classList.replace(
          "vjs-icon-fullscreen-exit",
          "vjs-icon-fullscreen-enter"
        );
      document
        .getElementById("video-container_Container_player")
        .classList.remove("fullscreen");
    }
  }

  return (
    <div id="video-container">
      <div className="video-container_Container">
        <div
          data-vjs-player
          id="video-container_Container_player"
          className="videoPlayer"
        >
          <div ref={videoRef} className="video-js vjs-default-skin" />
        </div>
      </div>
    </div>
  );
};

export default BasicVideoJS;
