import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col, Stack, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../axios";
import BtnBootstrap from "../../components/BtnBootstrap";
import LoadingComponent from "../../components/LoadingComponent";
import { AiFillLock } from "react-icons/ai";
import styles from "../../styles/pages/VideoList.module.scss";
import useModal from "../../js/useModal";

export default function BasicVideoList({ loadingText = "資訊載入中" }) {
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user")
  );

  const title = `基本練習衛教資訊`;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(null);
  const [
    isConfirmingToLatestTime,
    closeIsConfirmingToLatestTime,
    showConfirmToLatestTimeModal,
  ] = useModal();

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
  }, []);

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
      const filterVideoData = data.filter((video) => video.videoType === 2);

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
        // 如果秒數小於10，則在前面加上0
        if (videoDurationSecond < 10) {
          return `${videoDurationMinute}:0${videoDurationSecond}`;
        } else {
          return `${videoDurationMinute}:${videoDurationSecond}`;
        }
      });
      setEachVideoDuration(eachVideoDurationArray);
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
            <div className={styles.videoListContainer}>
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
                  </Col>
                </Row>
              </Container>
            </div>
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
                    目前影片完成觀看進度為：
                    {open.accuracy === 100 ? "完成" : "未完成"}，
                    <b className="text-danger">
                      {open.accuracy === 100 ? "可進行題目測驗" : "請繼續努力"}
                    </b>
                  </p>
                )}
              </Col>
            </Row>
            <Stack gap={3}>
              <BtnBootstrap
                onClickEventName={() => {
                  // 若有保留觀看進度，則跳出確認視窗
                  if (open !== null && open.videoLastestTime > 0) {
                    showConfirmToLatestTimeModal();
                  }
                  // 若沒有保留觀看進度，則直接跳轉到影片播放頁面
                  else {
                    navigate("/Basicvideo", {
                      state: {
                        videoPath: open.video_url,
                        videoID: open.videoCertainID,
                      },
                    });
                  }
                }}
                text={`開始基本練習`}
                variant={"outline-primary"}
              />
              {open !== null && open.QuestionData.length !== 0 && (
                <BtnBootstrap
                  text={
                    open !== null &&
                    (open.accuracy === 100 ? (
                      `題目測驗`
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
                      navigate(
                        "/basic/videoQuestion",

                        {
                          state: {
                            info: open.QuestionData,
                          },
                        }
                      );

                    // open !== null &&
                    //   open.accuracy === 100 &&
                  }}
                  // disabled={open !== null && open.accuracy !== 100}
                />
              )}
            </Stack>
          </Container>
        </Modal.Body>
      </Modal>
      {/* 若有保留觀看紀錄，Modal */}
      <Modal
        show={isConfirmingToLatestTime}
        onHide={closeIsConfirmingToLatestTime}
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
              navigate("/Basicvideo", {
                state: {
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
              closeIsConfirmingToLatestTime();
              navigate("/Basicvideo", {
                state: {
                  videoPath: open.video_url,
                  videoID: open.videoCertainID,
                  latestWatchTime: open.videoLastestTime,
                },
              });
            }}
          />
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
