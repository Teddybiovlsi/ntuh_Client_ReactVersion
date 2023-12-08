import React from "react";
import { useState, useEffect } from "react";
import {
  Container,
  Collapse,
  Row,
  Col,
  ProgressBar,
  Stack,
  Modal,
  Image,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../axios";
import BtnBootstrap from "../../components/BtnBootstrap";
import LoadingComponent from "../../components/LoadingComponent";
import { AiFillLock } from "react-icons/ai";
import styles from "../../styles/pages/VideoList.module.scss";
import useModal from "../../js/useModal";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { IoIosArrowForward } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";
import PageTitleHeading from "../../components/PageTitleHeading";

export default function VideoList({
  PageTitle = 0,
  loadingText = "Loading",
  user,
}) {
  const pageTitle = PageTitle ? "測驗用" : "練習用";
  const title = `${pageTitle}衛教資訊`;

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const [openChapter, setOpenChapter] = useState(null);

  const [originVideoData, setOriginVideoData] = useState([]);
  const [QuestionData, setQuestionData] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
  const [eachVideoDuration, setEachVideoDuration] = useState([]);
  const [eachVideoChapterDuration, setEachVideoChapterDuration] = useState([]);

  const [
    ConfirmingToLatestTimeModal,
    handleCloseConfirmingToLatestTime,
    handleShowConfirmToLatestTimeModal,
  ] = useModal();

  const navigate = useNavigate();

  const checkIsClient = user?.permission === "ylhClient";

  useEffect(() => {
    const fetchVideos = async () => {
      if (checkIsClient) {
        const usrToken = user?.client_token;
        const usrVideo = user?.video;
        await fetchVideoList({
          api: `client/${usrToken}/video/[${usrVideo}]`,
        });
      } else {
        const usrToken = user?.guestInfo;
        await fetchVideoList({
          api: `guest/info/video/${usrToken}`,
        });
      }
    };

    fetchVideos();
  }, [PageTitle]);

  const fetchVideoList = async ({ api }) => {
    try {
      // Get data from the API
      const response = await get(api);
      const data = response.data.video;
      // Check if data is an array
      const checkIsArray = Array.isArray(data);

      // Set videoData
      const videoData = checkIsArray ? data : [data];
      setOriginVideoData(videoData);

      // Filter videoData with videoType equal to PageTitle
      const filterVideoData = data.filter(
        (video) => video.videoType === Number(PageTitle)
      );

      // Set setOpenArray to an array of false values with the same length as filterVideoData
      // const setOpenArray = new Array(filterVideoData.length).fill(false);
      // setOpen(setOpenArray);

      // Check if filterVideoData is empty
      setArrayIsEmpty(filterVideoData.length === 0);

      setOriginVideoData(filterVideoData);

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      const errorMessage = error.response.data.message;

      if (errorMessage === "發生錯誤，請重新登入") {
        if (sessionStorage.getItem("user")) sessionStorage.clear();
        if (localStorage.getItem("user")) localStorage.clear();

        alert(errorMessage);
        navigate("/");
      } else {
        alert("發生不明錯誤，請重新嘗試");
        navigate("/Home", { replace: true });
      }
    }
  };
  // 設定每個影片的總時長
  useEffect(() => {
    if (originVideoData.length !== 0) {
      const eachVideoDurationArray = originVideoData.map((video) => {
        const videoDuration = Math.round(video.videoDuration);
        const videoDurationMinute = Math.floor(videoDuration / 60);
        const videoDurationSecond = videoDuration % 60;
        return `${videoDurationMinute}:${videoDurationSecond}`;
      });
      setEachVideoDuration(eachVideoDurationArray);
    }
  }, [originVideoData]);

  // 定義一個函數，計算章節持續時間
  function calculateChapterDurations(questions) {
    return questions.map((question, index) => {
      const videoInterruptTime = Math.round(question.video_interrupt_time);
      const prevVideoInterruptTime =
        index === 0 ? 0 : Math.round(questions[index - 1].video_interrupt_time);
      const questionDuration = videoInterruptTime - prevVideoInterruptTime;

      const questionDurationMinute = Math.floor(questionDuration / 60);
      const questionDurationSecond = questionDuration % 60;

      return `${questionDurationMinute}:${questionDurationSecond}`;
    });
  }

  useEffect(() => {
    if (originVideoData.length !== 0) {
      const eachVideoChapterDurationArray = originVideoData.reduce(
        (acc, video) => {
          const videoCertainID = video.videoCertainID;
          acc[videoCertainID] = calculateChapterDurations(video.QuestionData);
          return acc;
        },
        {}
      );
      setEachVideoChapterDuration(eachVideoChapterDurationArray);
    }
  }, [originVideoData]);

  function ImageComponent({ src }) {
    const [isVertical, setIsVertical] = useState(false);

    useEffect(() => {
      const img = new window.Image();
      img.src = src;
      img.onload = function () {
        setIsVertical(this.height > this.width);
      };
    }, [src]);

    return (
      <Image
        key={Math.random()}
        src={src}
        style={{
          objectFit: isVertical ? "contain" : "",
          maxHeight: isVertical ? "500px" : "auto",
        }}
      />
    );
  }

  if (loading) {
    return <LoadingComponent title={title} text={loadingText} />;
  }
  if (arrayIsEmpty) {
    return (
      <Container>
        <h1 className="text-center">{title}</h1>
        <h2 className="m-3 p-3 text-center">{`沒有對應的${title}`}</h2>
      </Container>
    );
  }
  if (
    !localStorage.getItem("iphoneAlertShown") &&
    navigator.userAgent.match(/iPhone/i)
  ) {
    alert(
      "目前使用iPhone，請留意在影片撥放全螢幕下無法正確顯示問題，請關閉全螢幕即可正確作答"
    );
    localStorage.setItem("iphoneAlertShown", true);
  }

  return (
    <>
      <PageTitleHeading text="衛教資訊" styleOptions={4} />
      <Container>
        {originVideoData.map((video, eachQuestionIndex) => {
          return (
            <>
              <p className="fs-4 ps-0 m-0">{video.Title}</p>
              <Row className={styles.videoListContainer}>
                <Col xs={10} md={11} lg={11}>
                  <Row>
                    <ImageComponent src={video.image_url} />
                    {/* <Image src={video.image_url} className="p-0" rounded /> */}
                  </Row>
                  {checkIsClient && (
                    <Row className={styles.learningProgressCol}>
                      <Col
                        xs={3}
                        md={2}
                        lg={2}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <CircularProgressbar
                          value={video.learningProgress}
                          text={`${video.learningProgress}%`}
                          styles={buildStyles({
                            textColor:
                              video.learningProgress === 100
                                ? "#00A3A3"
                                : "#FFD4D4",
                            pathColor:
                              video.learningProgress === 100
                                ? "#00A3A3"
                                : "#940000",
                            trailColor:
                              video.learningProgress === 100
                                ? "#F2FFFF"
                                : "#FFD4D4",
                          })}
                        />
                      </Col>
                      <Col xs={9} md={10} lg={10} className={`fs-3 `}>
                        <p className={`m-0 ${styles.learningProgressFont}`}>
                          學習進度：
                        </p>
                        <p
                          className={`m-0 ${
                            video.learningProgress === 100
                              ? styles.learningProgressProgressSuccess
                              : "text-danger"
                          }`}
                        >
                          {video.learningProgress}%
                        </p>
                      </Col>
                    </Row>
                  )}
                  {!checkIsClient && (
                    <Row className={styles.guestLearningProgressCol}>
                      <p className="m-0 fs-4">
                        <FaLock />
                        <br />
                        權限不足無法訪問
                      </p>
                    </Row>
                  )}
                </Col>
                <Col
                  xs={2}
                  md={1}
                  lg={1}
                  className={styles.linkToStartLearning}
                  as="button"
                  onClick={() => {
                    setOpen(video);
                  }}
                >
                  <h1>
                    <IoIosArrowForward />
                  </h1>
                </Col>
              </Row>
            </>
          );
        })}
        {/* 練習／測驗打開開始後顯示Modal視窗 */}
        <Modal
          show={open !== null}
          onHide={() => {
            setOpen(null);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>請選擇欲觀看的類型</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col>
                  {open !== null && checkIsClient && (
                    <p>
                      目前分數為：{open.accuracy}分，
                      <b
                        className={
                          open.accuracy === 100 ? "text-success" : "text-danger"
                        }
                      >
                        {open.accuracy === 100
                          ? "可使用章節個別練習"
                          : "請繼續努力"}
                      </b>
                    </p>
                  )}
                </Col>
              </Row>
              <Stack gap={3}>
                <BtnBootstrap
                  text={`瀏覽`}
                  variant={"outline-primary"}
                  onClickEventName={() => {
                    if (open.videoLastestTime === 0) {
                      navigate("/video/only", {
                        state: {
                          info: open.QuestionData,
                          videoPath: open.video_url,
                          videoID: open.videoCertainID,
                          latestWatchTime: 0,
                        },
                      });
                    } else {
                      handleShowConfirmToLatestTimeModal();
                    }
                  }}
                />
                <BtnBootstrap
                  text={`開始${PageTitle ? "測驗" : "練習"}`}
                  variant={"outline-primary"}
                  onClickEventName={() => {
                    navigate("/video", {
                      state: {
                        videoPath: open.video_url,
                        videoID: open.videoCertainID,
                        questionData: open.QuestionData,
                        pageTitle: PageTitle,
                      },
                    });
                  }}
                />
                {checkIsClient && (
                  <BtnBootstrap
                    text={
                      open !== null &&
                      (open.accuracy === 100 ? (
                        `章節練習`
                      ) : (
                        <p className="text-danger m-0 p-0">
                          <AiFillLock />
                          鎖定中
                        </p>
                      ))
                    }
                    variant={
                      open !== null && open.accuracy === 100
                        ? "outline-primary"
                        : "outline-danger"
                    }
                    onClickEventName={() => {
                      open !== null &&
                        open.accuracy === 100 &&
                        setOpenChapter(open);
                    }}
                    disabled={open !== null && open.accuracy !== 100}
                  />
                )}
              </Stack>
            </Container>
          </Modal.Body>
        </Modal>
        {/* 若有保留觀看紀錄，Modal */}
        <Modal
          show={ConfirmingToLatestTimeModal}
          onHide={handleCloseConfirmingToLatestTime}
        >
          <Modal.Header closeButton>
            <Modal.Title>請確認</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>
              您上次觀看影片的進度為
              <b className="text-primary">
                {open !== null && Math.round(open.videoLastestTime * 10) / 10}
              </b>
              秒，是否繼續觀看？
            </p>
            <p className="text-danger">若選擇取消，則觀看進度將會重置為0秒</p>
          </Modal.Body>

          <Modal.Footer>
            <BtnBootstrap
              text={`取消`}
              variant={"outline-secondary"}
              onClickEventName={() => {
                navigate("/video/only", {
                  state: {
                    info: open.QuestionData,
                    videoPath: open.video_url,
                    videoID: open.videoCertainID,
                    latestWatchTime: 0,
                  },
                });
              }}
            />
            <BtnBootstrap
              text={`確認`}
              variant={"outline-primary"}
              onClickEventName={() => {
                handleCloseConfirmingToLatestTime();
                navigate("/video/only", {
                  state: {
                    info: open.QuestionData,
                    videoPath: open.video_url,
                    videoID: open.videoCertainID,
                    latestWatchTime: open.videoLastestTime,
                  },
                });
              }}
            />
          </Modal.Footer>
        </Modal>

        <Modal
          show={openChapter}
          onHide={() => {
            setOpenChapter(null);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>請選擇欲觀看的章節</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {openChapter !== null && (
              <Stack gap={1}>
                {openChapter.QuestionData.map((question, index) => {
                  return (
                    <Link
                      key={index}
                      to={"/video/chapter"}
                      state={{
                        videoID: open.videoCertainID,
                        videoPath: open.video_url,
                        videoCurrentTime:
                          index === 0
                            ? 0
                            : openChapter.QuestionData[index - 1]
                                .video_interrupt_time,
                        videoInterruptTime: question.video_interrupt_time,
                        info: question,
                      }}
                      className={styles.videoListLink}
                    >
                      <div className={styles.videoListContainer}>
                        <div className="m-0">
                          <Container>
                            <Row className="align-items-center">
                              <Col>
                                <Row>
                                  <Col md={6}>
                                    <h3 className={styles.titleChapter}>{`第 ${
                                      index + 1
                                    } 章`}</h3>
                                  </Col>
                                  <Col md={6} className="my-auto">
                                    <div className="float-end ">
                                      {`時間長度 ${
                                        eachVideoChapterDuration[
                                          open.videoCertainID
                                        ][index]
                                      }`}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>{question.video_question}</Col>
                                </Row>
                              </Col>
                            </Row>
                          </Container>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </Stack>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
