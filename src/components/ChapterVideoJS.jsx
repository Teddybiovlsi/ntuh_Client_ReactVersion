import { useState, useEffect, useRef } from "react";
import React from "react";
import { Col, Form, Row, Toast } from "react-bootstrap";
import BtnBootstrap from "./BtnBootstrap";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./videoqa.css";
import { useNavigate } from "react-router-dom";
import ToastAlert from "./ToastAlert";
import { toast } from "react-toastify";
import { post } from "../client/axios";

export const ChapterVideoJS = (props) => {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  // const [currentTime, setCurrentTime] = useState(null);
  const playerRef = useRef(null);
  // 取得當前章節的資料
  const { VideoID, VideoCurrentTime, options, info } = props;
  const [sendstate, setSendstate] = useState(false);
  const [optionChecked, setOptionChecked] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tempQuestionNum, setTempQuestionNum] = useState(1);

  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [haveAnswerOrNot, setHaveAnswerOrNot] = useState(false);
  const [answerState, setAnswerState] = useState([]);

  const [screen, setScreen] = useState({
    width: "",
    height: "",
  });

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    console.log("shuffledArray", shuffledArray.length);
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  };

  const [shuffledInfo, setShuffledInfo] = useState(info);

  const handleShuffle = () => {
    const newChoice = { ...info.choice };
    const values = Object.values(newChoice);
    const shuffledValues = shuffleArray(values);

    Object.keys(newChoice).forEach((key, index) => {
      newChoice[key] = shuffledValues[index];
    });

    const newShuffledInfo = { ...info, choice: newChoice };
    setShuffledInfo(newShuffledInfo);
  };

  // calculate the total length of the array
  let arrayNum = 0;

  console.log("currentTime", VideoCurrentTime);

  const handleCheckedAnswer = (e) => {
    setOptionChecked(e.target.value);
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
  };

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      // if screen size is smaller than 768px, then add fullscreen button
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
      }));

      player.currentTime(VideoCurrentTime);

      // addChild("componentName", {componentProps}, componentIndex)
      // 其中componentIndex為可選參數，若不指定則預設為0，代表在controlBar的第一個位置
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

      player.on("waiting", () => {
        console.log("player is waiting");
      });
      player.on("play", () => {
        console.log("sendState", sendstate);
        // console.log("player is play");
      });
      player.on("pause", () => {
        // console.log("ArrayNum", arrayNum);
        // console.log("tempQuestionNum", tempQuestionNum);
        setTempQuestionNum(arrayNum);
      });

      // Add event listener for loadedmetadata
      player.on("loadedmetadata", () => {
        const video = player;
        handleShuffle();
        if (video.videoHeight() > video.videoWidth()) {
          player.aspectRatio("16:7");
        } else {
          player.fluid(true);
        }
      });

      player.on("timeupdate", () => {
        if (arrayNum < tempQuestionNum) {
          if (player.currentTime() >= info.video_interrupt_time) {
            player.pause();
            setSendstate(true);
            setTimeout(() => {
              setHaveAnswerOrNot(true);
              setSendstate(false);
              player.play();
            }, info.video_duration * 1000);
            arrayNum++;
          }
        } else {
          player.pause();
          player.controls(false);
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

  useEffect(() => {
    console.log("sendstate", sendstate);
    console.log("haveAnswerOrNot", haveAnswerOrNot);
    if (
      haveAnswerOrNot === true &&
      sendstate === false &&
      correctAnswer === false &&
      wrongAnswer === false
    ) {
      setAnswerState([
        ...answerState,
        {
          token: JSON.parse(localStorage.getItem("user")).client_token,
          videoID: VideoID,
          quizID: [shuffledInfo.quiz_id],
          answerStatus: [false],
        },
      ]);
      playerRef.current.pause();
      alert("測試未回答");
    }
  }, [sendstate]);

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

  function handleSubmitAnswer() {
    let answer = "";
    if (
      shuffledInfo.choice.option_3 !== undefined &&
      shuffledInfo.choice.option_4 !== undefined
    ) {
      // find the answer which option[1] is 1
      if (shuffledInfo.choice.option_1[1] === 1) {
        answer = shuffledInfo.choice.option_1[0];
      } else if (shuffledInfo.choice.option_2[1] === 1) {
        answer = shuffledInfo.choice.option_2[0];
      } else if (shuffledInfo.choice.option_3[1] === 1) {
        answer = shuffledInfo.choice.option_3[0];
      } else if (shuffledInfo.choice.option_4[1] === 1) {
        answer = shuffledInfo.choice.option_4[0];
      }
    } else if (
      shuffledInfo.choice.option_3 !== undefined &&
      shuffledInfo.choice.option_4 === undefined
    ) {
      // find the answer which option[1] is 1
      if (shuffledInfo.choice.option_1[1] === 1) {
        answer = shuffledInfo.choice.option_1[0];
      } else if (shuffledInfo.choice.option_2[1] === 1) {
        answer = shuffledInfo.choice.option_2[0];
      } else if (shuffledInfo.choice.option_3[1] === 1) {
        answer = shuffledInfo.choice.option_3[0];
      }
    } else {
      // find the answer which option[1] is 1
      if (shuffledInfo.choice.option_1[1] === 1) {
        answer = shuffledInfo.choice.option_1[0];
      } else if (shuffledInfo.choice.option_2[1] === 1) {
        answer = shuffledInfo.choice.option_2[0];
      }
    }
    if (optionChecked === answer) {
      setAnswerState([
        ...answerState,
        {
          token: JSON.parse(localStorage.getItem("user")).client_token,
          videoID: VideoID,
          quizID: [shuffledInfo.quiz_id],
          answerStatus: [true],
        },
      ]);
      setSendstate(false);
      setCorrectAnswer(true);
      // playerRef.current.play();
      // alert("答對了");
      // navigate("/", { replace: true });
      console.log("answerState", answerState);

      // navigate("/videoChapterPlayer", { replace: true }");
    } else {
      setAnswerState([
        ...answerState,
        {
          token: JSON.parse(localStorage.getItem("user")).client_token,
          videoID: VideoID,
          quizID: [shuffledInfo.quiz_id],
          answerStatus: [false],
        },
      ]);
      setSendstate(false);
      setWrongAnswer(true);
      // playerRef.current.play();
      // navigate("/", { replace: true });
    }
  }

  useEffect(() => {
    if (answerState.length > 0) {
      console.log("answerState", answerState[0]);
      handleSubmitAnswerToAPI({ api: "client/record" });
    }
  }, [answerState]);

  const handleSubmitAnswerToAPI = async ({ api }) => {
    // 顯示loading圖示
    let id = toast.loading("上傳中...");
    // 透過try catch來處理錯誤
    // console.log("answerState", answerState);

    try {
      // 透過await來等待promise resolve
      const res = await post(api, answerState[0]);
      let outputMessage = "";
      if (answerState[0].answerStatus[0] === true) {
        outputMessage = "答對了，2秒後將回到影片清單頁\n請稍後...";
      } else {
        if (haveAnswerOrNot === true) {
          outputMessage =
            "未回答，請重新練習\n2秒後將回到影片清單頁\n請稍後...";
        } else {
          outputMessage =
            "答錯了，請重新練習\n2秒後將回到影片清單頁\n請稍後...";
        }
      }
      // 關閉loading圖示
      toast.update(id, {
        render: outputMessage,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => {
        // navigate to pervious page
        navigate(-1, { replace: true });
      }, 2000);
    } catch (err) {
      console.log("err", err.response.data);
      toast.update(id, {
        render: "上傳失敗，請稍後再試",
        type: "fail",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

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
        {sendstate && (
          <div id="video-container-textfield" className="text-overlay">
            <Form>
              <h1 className="text-overlay_title pt-2 pb-2">
                第{tempQuestionNum + 1}題
              </h1>
              <Col className="fs-4 mt-2 mb-2">
                {shuffledInfo.video_question}
                {/* {info[0].video_question} */}
              </Col>
              <Row>
                <Col className="fs-4" md={6} xs={6}>
                  <Form.Check
                    type="radio"
                    label={shuffledInfo.choice.option_1[0]}
                    value={shuffledInfo.choice.option_1[0]}
                    name="option_1"
                    id="formHorizontalRadios1"
                    className="selectOption"
                    checked={
                      optionChecked === shuffledInfo.choice.option_1[0]
                        ? true
                        : false
                    }
                    onChange={handleCheckedAnswer}
                  />
                </Col>
                <Col className="fs-4" md={6} xs={6}>
                  <Form.Check
                    type="radio"
                    label={shuffledInfo.choice.option_2[0]}
                    value={shuffledInfo.choice.option_2[0]}
                    name="option_2"
                    id="formHorizontalRadios2"
                    className="selectOption"
                    checked={
                      optionChecked === shuffledInfo.choice.option_2[0]
                        ? true
                        : false
                    }
                    onChange={handleCheckedAnswer}
                  />
                </Col>
                {shuffledInfo.choice.option_3 !== undefined && (
                  <Col className="fs-4" md={6} xs={6}>
                    <Form.Check
                      type="radio"
                      label={shuffledInfo.choice.option_3[0]}
                      value={shuffledInfo.choice.option_3[0]}
                      name="option_3"
                      id="formHorizontalRadios3"
                      className="selectOption"
                      checked={
                        optionChecked === shuffledInfo.choice.option_3[0]
                          ? true
                          : false
                      }
                      onChange={handleCheckedAnswer}
                    />
                  </Col>
                )}
                {shuffledInfo.choice.option_4 !== undefined && (
                  <Col className="fs-4" md={6} xs={6}>
                    <Form.Check
                      type="radio"
                      label={shuffledInfo.choice.option_4[0]}
                      value={shuffledInfo.choice.option_4[0]}
                      name="option_4"
                      id="formHorizontalRadios4"
                      className="selectOption"
                      checked={
                        optionChecked === shuffledInfo.choice.option_4[0]
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        console.log(e.target.value);
                        setOptionChecked(e.target.value);
                      }}
                    />
                  </Col>
                )}
              </Row>
              <Col className="sendBtn">
                <BtnBootstrap
                  id="resetBtn"
                  btnName="ResetBtn"
                  btnPosition="btn-start"
                  text={"重置"}
                  variant={"btn reset me-3"}
                  onClickEventName={() => {
                    setOptionChecked("");
                  }}
                />
                <BtnBootstrap
                  id="sendBtn"
                  btnName="ConfirmBtn"
                  text={"送出"}
                  variant={"btn send"}
                  onClickEventName={() => {
                    handleSubmitAnswer();
                  }}
                />
              </Col>
            </Form>
          </div>
        )}
      </div>
      <ToastAlert />
    </div>
  );
};

export default ChapterVideoJS;
