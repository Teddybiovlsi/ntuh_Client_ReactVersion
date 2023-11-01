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
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../axios";
import BtnBootstrap from "../../components/BtnBootstrap";
import LoadingComponent from "../../components/LoadingComponent";
import { AiFillLock } from "react-icons/ai";
import styles from "../../styles/pages/VideoList.module.scss";

export default function VideoList({ PageTitle = 0, loadingText = "Loading" }) {
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user")
  );

  const pageTitle = PageTitle ? "測驗用" : "練習用";
  const title = `${pageTitle}衛教資訊`;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(null);
  const [openChapter, setOpenChapter] = useState(null);

  const [originVideoData, setOriginVideoData] = useState([]);
  const [QuestionData, setQuestionData] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
  const [eachVideoDuration, setEachVideoDuration] = useState([]);
  const [eachVideoChapterDuration, setEachVideoChapterDuration] = useState([]);

  const userData =
    JSON.parse(
      localStorage?.getItem("user") || sessionStorage.getItem("user")
    ) || {};
  const usrToken = userData.client_token;
  const usrVideo = userData.video;

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchVideoList({
      api: `client/${usrToken}/video/[${usrVideo}]`,
    });
  }, [PageTitle]);

  const fetchVideoList = async ({ api }) => {
    try {
      // Get data from the API
      const response = await get(api);
      const data = await response.data.video;
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
    <Container>
      <h1 className="fw-bold text-center">{title}</h1>
      {originVideoData.map((video, eachQuestionIndex) => {
        return (
          <div key={video.videoCertainID}>
            <div
              className={styles.videoListContainer}
              // onClick={() => {
              //   setOpen((prev) => {
              //     const copy = [...prev];
              //     copy[eachQuestionIndex] = !copy[eachQuestionIndex];
              //     return copy;
              //   });
              // }}
            >
              <Container>
                <Row className="align-items-center">
                  <Col>
                    <Row>
                      <div className="fs-3 m-0">
                        {eachQuestionIndex + 1 + ". "}
                        {video.Title}
                      </div>
                    </Row>
                    <Row>
                      {eachVideoDuration[eachQuestionIndex] ? (
                        <div className={`m-0 ${styles.eachVideoListDuration}`}>
                          總時長：{eachVideoDuration[eachQuestionIndex]}
                        </div>
                      ) : null}
                    </Row>
                  </Col>

                  <Col className="align-items-center" md={4}>
                    <Stack gap={1}>
                      <BtnBootstrap
                        text={`開始`}
                        variant={"outline-primary"}
                        onClickEventName={() => {
                          // set current video into setOpen
                          setOpen(video);
                        }}
                      />
                    </Stack>
                    {/* <ProgressBar
                      now={video.accuracy}
                      label={`${video.accuracy}%`}
                    /> */}
                  </Col>

                  {/* <Col className="align-items-center">
                    <div className="float-end align-items-center fs-3">
                      <BiRightArrow />
                    </div>
                  </Col> */}
                </Row>
              </Container>
            </div>
            {/* <Collapse in={open[eachQuestionIndex]}>
              <div id={`collapse-text-${eachQuestionIndex}`}>
                {video.QuestionData.map((question, index) => {
                  return (
                    <Link
                      key={index * 1011}
                      to={"/video/chapter"}
                      state={{
                        videoID: video.videoCertainID,
                        videoPath: video.video_url,
                        videoCurrentTime:
                          index === 0
                            ? 0
                            : video.QuestionData[index - 1]
                                .video_interrupt_time,
                        videoInterruptTime: question.video_interrupt_time,
                        info: question,
                      }}
                      className={styles.videoListLink}
                    >
                      <div className={styles.videoListContainer}>
                        <div className="fs-5 m-0">
                          <Container>
                            <Row className="align-items-center">
                              <Col>
                                <Row>
                                  <Col md={6}>
                                    <h3 className={styles.titleChapter}>{`第 ${
                                      index + 1
                                    } 章`}</h3>
                                    <div>
                                      {`時間長度 ${eachVideoChapterDuration[eachQuestionIndex][index]}`}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                              <Col className="text-end" md={4}>
                                <ProgressBar
                                  now={question.eachQuizAccuracy * 100}
                                  label={`${question.eachQuizAccuracy * 100}%`}
                                />
                              </Col>
                            </Row>
                          </Container>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Collapse> */}
          </div>
        );
      })}
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
                {open !== null && (
                  <p>
                    目前分數為：{open.accuracy}分，
                    <b className="text-danger">
                      {open.accuracy === 1
                        ? "可使用章節個別練習"
                        : "請繼續努力"}
                    </b>
                  </p>
                )}
              </Col>
            </Row>
            <Stack gap={3}>
              <BtnBootstrap text={`瀏覽`} variant={"outline-primary"} />
              <BtnBootstrap
                text={`開始${PageTitle ? "測驗" : "練習"}`}
                variant={"outline-primary"}
              />
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
            </Stack>
          </Container>
        </Modal.Body>
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
  );
}
