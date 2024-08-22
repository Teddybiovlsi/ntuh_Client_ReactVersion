import { useState, useEffect, useRef } from "react";
import React from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import BtnBootstrap from "./BtnBootstrap";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./videoqa.css";
import { post } from "../client/axios";
import { getUserSession } from "../js/userAction";
import { useNavigate } from "react-router-dom";
import { clearUserSession } from "../js/userAction";

export const VideoJS = (props) => {
  const user = getUserSession();
  const navigate = useNavigate();

  const checkIsClient = user?.permission === "ylhClient";

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, info, pageTitle, questionData, videoID, examType } = props;
  const [sendstate, setSendstate] = useState(false);
  const [optionChecked, setOptionChecked] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tempQuestionNum, setTempQuestionNum] = useState(1);

  const [remainingTime, setRemainingTime] = useState(0);

  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
  const [answer, setAnswer] = useState(null);

  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [haveAnswerOrNot, setHaveAnswerOrNot] = useState(false);
  const [answerState, setAnswerState] = useState([]);
  const [haveWatchedTime, setHaveWatchedTime] = useState(0);

  const [timeOut, setTimeOut] = useState(false);
  const [shouldReset, setShouldReset] = useState(true);

  const [correctModal, setCorrectModal] = useState(false);
  const [wrongModal, setWrongModal] = useState(false);
  const [wrongAnswerReachLimit, setWrongAnswerReachLimit] = useState(false);

  // set the time out id
  const timeoutId = useRef(null);
  // set the count down interval id
  const countDownIntervalId = useRef(null);

  const uploadTheAnswer = async (data) => {
    // let alertToastID = toast.loading("上傳中...");
    if (checkIsClient) {
      try {
        const response = await post(`client/record/${user.client_token}`, data);

        console.log("上傳成功");
        console.log(response.data);
      } catch (error) {
        if (error.response.data.error === "Token expired") {
          alert("登入逾時，請重新登入！");
          clearUserSession();
          navigate("/", { replace: true });
        } else {
          console.log(error.response);

          console.log("上傳失敗");
        }
      }
    }
  };

  // 開始計時
  const startCountDown = (remainingTime = 0) => {
    if (remainingTime === 0) return;

    setRemainingTime(remainingTime);

    countDownIntervalId.current = setInterval(() => {
      setRemainingTime((remainingTime) => remainingTime - 1);
    }, 1000);

    timeoutId.current = setTimeout(() => {
      setTimeOut(true);
    }, remainingTime * 1000);
  };

  // 重置並繼續播放影片
  const resetAndPlay = () => {
    clearInterval(countDownIntervalId.current);
    clearTimeout(timeoutId.current);
    setOptionChecked("");
    setCorrectModal(false);
    setWrongModal(false);
    setShouldReset(false);
    setWrongAnswerCount(0);
    setSendstate(false);
    playerRef.current.play();
  };

  // set 當下所選擇的答案名稱
  const handleCheckedAnswer = (e) => {
    setOptionChecked(e.target.value);
  };

  // 送出答案function
  function handleSubmitAnswer(answer = "") {
    clearInterval(countDownIntervalId.current);
    clearTimeout(timeoutId.current);

    let chosenAnswer = answer || optionChecked || "noAnswer";

    console.log("chosenAnswer", chosenAnswer);

    // console.log("chosenAnswer is", chosenAnswer);

    // console.log("tempQuestionNum", tempQuestionNum);
    // console.log("info[tempQuestionNum - 1]", info[tempQuestionNum - 1]);
    // console.log("optionChecked", optionChecked);
    // 如果為警告訊息，則直接接續撥放影片
    if (info[tempQuestionNum - 1].video_is_question === 0) {
      const data = {
        token: user.client_token,
        videoID: videoID,
        quizID: [info[tempQuestionNum - 1].quiz_id],
        answerStatus: [1],
        examType: examType,
        failCount: 0,
        already_watch_time: info[tempQuestionNum - 1].video_interrupt_time,
      };

      uploadTheAnswer(data);
      resetAndPlay();
      return;
    } else {
      let correctAnswer;

      for (let i = 1; i <= 4; i++) {
        let option = info[tempQuestionNum - 1][`option_${i}`];
        if (option !== undefined && option[1] === 1) {
          correctAnswer = option[0];
          break;
        }
      }

      console.log("correctAnswer", correctAnswer);

      if (chosenAnswer === "noAnswer") {
        setAnswer(correctAnswer);
        if (wrongAnswerCount < 2) {
          const data = {
            token: user.client_token,
            videoID: videoID,
            quizID: [info[tempQuestionNum - 1].quiz_id],
            answerStatus: [2],
            examType: examType,
            failCount: wrongAnswerCount + 1,
            already_watch_time: 0,
          };

          uploadTheAnswer(data);
        } else {
          const data = {
            token: user.client_token,
            videoID: videoID,
            quizID: [info[tempQuestionNum - 1].quiz_id],
            answerStatus: [2],
            examType: examType,
            failCount: wrongAnswerCount + 1,
            already_watch_time: info[tempQuestionNum - 1].video_interrupt_time,
          };

          uploadTheAnswer(data);
        }

        setShouldReset(true);
        setWrongAnswerCount((wrongAnswerCount) => wrongAnswerCount + 1);
        setWrongModal(true);
      } else {
        console.log("correctAnswer", correctAnswer);

        if (optionChecked === correctAnswer) {
          setAnswerState([
            ...answerState,
            {
              tempQuestionNum: info[tempQuestionNum - 1].quiz_id,
              correctAnswer: true,
              wrongAnswer: "",
              timeOutNoAnswer: false,
            },
          ]);
          const data = {
            token: user.client_token,
            videoID: videoID,
            quizID: [info[tempQuestionNum - 1].quiz_id],
            answerStatus: [1],
            examType: examType,
            failCount: 0,
            already_watch_time: info[tempQuestionNum - 1].video_interrupt_time,
          };

          uploadTheAnswer(data);

          console.log("data", data);

          setCorrectModal(true);
        } else {
          if (wrongAnswerCount < 2) {
            // console.log("wrongAnswerCount", wrongAnswerCount);
            // console.log("[info[tempQuestionNum - 1].quiz_id]", [
            //   info[tempQuestionNum - 1].quiz_id,
            // ]);
            const data = {
              token: user.client_token,
              videoID: videoID,
              quizID: [info[tempQuestionNum - 1].quiz_id],
              answerStatus: [0],
              examType: examType,
              failCount: wrongAnswerCount + 1,
              already_watch_time: 0,
            };

            uploadTheAnswer(data);
          } else {
            // console.log("wrongAnswerCount", wrongAnswerCount);
            const data = {
              token: user.client_token,
              videoID: videoID,
              quizID: [info[tempQuestionNum - 1].quiz_id],
              answerStatus: [0],
              examType: examType,
              failCount: wrongAnswerCount + 1,
              already_watch_time:
                info[tempQuestionNum - 1].video_interrupt_time,
            };

            uploadTheAnswer(data);
          }

          setOptionChecked("");
          setShouldReset(true);
          setAnswer(correctAnswer);
          setWrongAnswerCount((wrongAnswerCount) => wrongAnswerCount + 1);
          setWrongModal(true);
        }
      }
    }
  }

  const handleTimeOut = () => {
    setTimeOut(true);
  };

  const [shuffledInfo, setShuffledInfo] = useState();

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const handleShuffle = (info) => {
    const values = Object.values(info.choice);

    const shuffledValues = shuffleArray(values);

    const newChoice = Object.keys(info.choice).reduce((result, key, index) => {
      result[key] = shuffledValues[index];
      return result;
    }, {});

    return { ...info, choice: newChoice };
  };

  useEffect(() => {
    if (shouldReset) {
      const shuffledInfos = questionData.map((info) => handleShuffle(info));
      setShuffledInfo(shuffledInfos);
      setShouldReset(false);
    }
  }, [shouldReset]);

  // calculate the total length of the array
  let arrayNum = 0;

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
        // videojs.log("player is ready");
      }));

      // addChild("componentName", {componentProps}, componentIndex)
      // 其中componentIndex為可選參數，若不指定則預設為0，代表在controlBar的第一個位置
      if (!navigator.userAgent.match(/iPhone/i)) {
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
      player.on("play", () => {
        console.log("sendState", sendstate);
        // console.log("player is play");
      });
      player.on("pause", () => {
        console.log("ArrayNum", arrayNum);

        setTempQuestionNum(arrayNum);
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

      player.on("timeupdate", () => {
        // console.log(arrayNum);
        // console.log(info.length);
        if (arrayNum < info.length) {
          // console.log("player.currentTime()", player.currentTime());
          // console.log(
          //   "info[arrayNum].video_interrupt_time",
          //   info[arrayNum].video_interrupt_time
          // );
          if (player.currentTime() >= info[arrayNum].video_interrupt_time) {
            player.pause();
            // handleShuffle(info.choice);
            setSendstate(true);
            setRemainingTime(info[arrayNum].video_duration);

            countDownIntervalId.current = setInterval(() => {
              setRemainingTime((remainingTime) => remainingTime - 1);
            }, 1000);

            timeoutId.current = setTimeout(() => {
              // handleSubmitAnswer();
              handleTimeOut();
              clearTimeout(timeoutId.current);
            }, info[arrayNum].video_duration * 1000);

            // startCountDown(info[arrayNum].video_duration);
            arrayNum++;
          }
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

  // 時間到時，自動送出答案
  // 若沒有答案則送出預設值
  // 若有答案則送出當下所選擇之答案
  useEffect(() => {
    if (timeOut) {
      handleSubmitAnswer(optionChecked);
      setTimeOut(false);
    }
  }, [timeOut, optionChecked]);

  useEffect(() => {
    if (
      haveAnswerOrNot === true &&
      sendstate === false &&
      correctAnswer === false &&
      wrongAnswer === false
    ) {
      setAnswerState([
        ...answerState,
        {
          token: user.client_token,
          videoID: VideoID,
          quizID: [shuffledInfo.quiz_id],
          answerStatus: [false],
          already_watch_time: haveWatchedTime,
        },
      ]);
      playerRef.current.pause();
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
            {info[tempQuestionNum - 1].video_is_question === 1 ? (
              correctModal && !wrongModal ? (
                <div id="video-container-textfield" className="text-overlay2">
                  <h1 className="text-overlay_title pt-2 pb-2">
                    <b>提示：</b>第{tempQuestionNum}題
                  </h1>
                  <Container>
                    <Col className="fs-4 ms-2 mt-2 mb-2">
                      <p className="text-center text-success m-0">
                        恭喜答對了！
                      </p>
                    </Col>
                  </Container>
                  <Stack>
                    <BtnBootstrap
                      onClickEventName={() => {
                        resetAndPlay();
                      }}
                      text={"確定"}
                      variant={"btn send"}
                    />
                  </Stack>
                </div>
              ) : wrongModal && !correctModal ? (
                <div id="video-container-textfield" className="text-overlay2">
                  <h1 className="text-overlay_title pt-2 pb-2">
                    <b>提示：</b>第{tempQuestionNum}題
                  </h1>
                  <Container>
                    {wrongAnswerCount > 1 ? (
                      <Col className="fs-4 ms-2 mt-2 mb-2">
                        <p>
                          <b className="text-danger">回答錯誤達到上限</b>，
                          {pageTitle === 0
                            ? `正確答案為${answer}`
                            : "請重新觀看"}
                        </p>
                      </Col>
                    ) : (
                      <Col className="ms-2 mt-2 mb-2">
                        <p className="fs-3 text-center text-danger m-0">
                          這是錯誤答案喔
                        </p>
                      </Col>
                    )}
                  </Container>
                  <Stack>
                    <BtnBootstrap
                      onClickEventName={() => {
                        startCountDown(
                          info[tempQuestionNum - 1].video_duration
                        );
                        setWrongModal(false);

                        if (wrongAnswerCount > 1) {
                          if (pageTitle === 0) {
                            resetAndPlay();
                          } else {
                            navigate("/test", { replace: true });
                          }
                        }
                      }}
                      text={"確定"}
                      variant={"btn send"}
                    />
                  </Stack>
                </div>
              ) : (
                <Form>
                  <h1 className="text-overlay_title pt-2 pb-2">
                    第{tempQuestionNum}題
                  </h1>
                  <Col className="fs-4 ms-2 mt-2 mb-2">
                    {info[tempQuestionNum - 1].video_question}
                  </Col>
                  <Row>
                    {shuffledInfo[tempQuestionNum - 1].choice.option_1 && (
                      <Option
                        option={
                          shuffledInfo[tempQuestionNum - 1].choice.option_1
                        }
                        optionChecked={optionChecked}
                        handleCheckedAnswer={handleCheckedAnswer}
                      />
                    )}
                    {shuffledInfo[tempQuestionNum - 1].choice.option_2 && (
                      <Option
                        option={
                          shuffledInfo[tempQuestionNum - 1].choice.option_2
                        }
                        optionChecked={optionChecked}
                        handleCheckedAnswer={handleCheckedAnswer}
                      />
                    )}
                    {shuffledInfo[tempQuestionNum - 1].choice.option_3 && (
                      <Option
                        option={
                          shuffledInfo[tempQuestionNum - 1].choice.option_3
                        }
                        optionChecked={optionChecked}
                        handleCheckedAnswer={handleCheckedAnswer}
                      />
                    )}
                    {shuffledInfo[tempQuestionNum - 1].choice.option_4 && (
                      <Option
                        option={
                          shuffledInfo[tempQuestionNum - 1].choice.option_4
                        }
                        optionChecked={optionChecked}
                        handleCheckedAnswer={handleCheckedAnswer}
                      />
                    )}
                  </Row>

                  <Stack gap={2}>
                    <p className="m-0">
                      剩餘時間：<b>{remainingTime}</b>
                    </p>
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
                  </Stack>
                </Form>
              )
            ) : (
              <Form>
                <h1 className="text-overlay_title pt-2 pb-2">
                  第{tempQuestionNum}題
                </h1>
                <Col className="fs-4 ms-2 mt-2 mb-2">
                  {info[tempQuestionNum - 1].video_question}
                </Col>
                <Col className="ms-2 mt-2 mb-2">
                  請按下OK或等待時間結束後，即可接續播放影片
                </Col>

                <Stack gap={2}>
                  <p className="m-0">
                    剩餘時間：<b>{remainingTime}</b>
                  </p>
                  <BtnBootstrap
                    id="sendBtn"
                    btnName="ConfirmBtn"
                    text={"送出"}
                    variant={"btn send"}
                    onClickEventName={() => {
                      handleSubmitAnswer();
                    }}
                  />
                </Stack>
              </Form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoJS;

const Option = ({ option, optionChecked, handleCheckedAnswer }) => (
  <Col className="fs-4" md={6} xs={6}>
    <Form.Check
      type="radio"
      label={option[0]}
      value={option[0]}
      name={`option_${option[0]}`}
      id={`formHorizontalRadios${option[0]}`}
      className="selectOption"
      checked={optionChecked === option[0]}
      onChange={handleCheckedAnswer}
    />
  </Col>
);
