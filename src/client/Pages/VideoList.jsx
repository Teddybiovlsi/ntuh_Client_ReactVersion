import React from 'react';
import { useState } from 'react';
import { Container, Collapse, Row, Col, ProgressBar } from 'react-bootstrap';
import { useEffect } from 'react';
import LoadingComponent from '../../components/LoadingComponent';
import { get } from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineArrowForwardIos as BiRightArrow } from 'react-icons/md';
import styles from '../../styles/pages/VideoList.module.scss';

export default function VideoList({ PageTitle = 0, loadingText = 'Loading' }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState([]);

  const [originVideoData, setOriginVideoData] = useState([]);
  const [QuestionData, setQuestionData] = useState([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
  const [eachVideoDuration, setEachVideoDuration] = useState([]);
  const [eachVideoChapterDuration, setEachVideoChapterDuration] = useState([]);

  const [videoProgress, setVideoProgress] = useState([25]);

  const usrToken = JSON.parse(localStorage?.getItem('user'))?.client_token;
  const usrVideo = JSON.parse(localStorage?.getItem('user'))?.video;

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchVideoList({
      api: `client/${usrToken}/video/[${usrVideo}]`,
    });
  }, [PageTitle]);

  const fetchVideoList = async ({ api }) => {
    try {
      const response = await get(api);
      // get data from res.data.data
      // because res.data.data is a promise
      // so we need to use await to get the value of res.data.data
      // and then we can use data to get the value of res.data.data
      const data = await response.data.video;
      // check if data is an array
      // if data is an array, checkIsArray is true
      // otherwise, checkIsArray is false
      const checkIsArray = Array.isArray(data);
      // set videoData
      // if checkIsArray is true, set videoData to data
      // otherwise, set videoData to [data]
      setOriginVideoData(checkIsArray ? data : [data]);

      // setQuestionData(checkIsArray ? data. : [data]);
      //   filterVideoData with videoType is zero
      const filterVideoData = data.filter(
        (video) => video.videoType === PageTitle
      );

      //  if originVideoData length is third then setOpen to [false, false, false]
      //  if originVideoData length is second then setOpen to [false, false]
      //  if originVideoData length is first then setOpen to [false]
      //  if originVideoData length is zero then setOpen to []
      const setOpenArray = [];
      for (let i = 0; i < filterVideoData.length; i++) {
        setOpenArray.push(false);
      }
      setOpen(setOpenArray);

      filterVideoData.length === 0
        ? setArrayIsEmpty(true)
        : setArrayIsEmpty(false);

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.log('error', error);
      // if error.response is true, get error message
      if (error.response) {
        console.log('error.response', error.response.data.message);
        if (error.response.data.message === '發生錯誤，請重新登入') {
          localStorage.removeItem('user');
          alert('登入逾時，請重新登入');
          navigate('/');
        }

        // setErrorMessage(StatusCode(error.response.status));
      }
    }
  };
  // 設定每個影片的總時長
  useEffect(() => {
    if (originVideoData.length !== 0) {
      const eachVideoDurationArray = [];
      originVideoData.forEach((video) => {
        const videoDuration = Math.round(video.videoDuration);

        // remove point and convert to minute:second
        const videoDurationMinute = Math.floor(videoDuration / 60);
        const videoDurationSecond = videoDuration % 60;
        const videoDurationString = `${videoDurationMinute}:${videoDurationSecond}`;
        eachVideoDurationArray.push(videoDurationString);
      });
      setEachVideoDuration(eachVideoDurationArray);
    }
  }, [originVideoData]);
  // 設定每個影片的章節總時長
  useEffect(() => {
    if (originVideoData.length !== 0) {
      const eachVideoChapterDurationArray = [];
      originVideoData.forEach((video) => {
        const videoChapterDurationArray = [];
        video.QuestionData.forEach((question, index) => {
          if (index === 0) {
            const questionDuration = Math.round(question.video_interrupt_time);
            // remove point and convert to minute:second
            const questionDurationMinute = Math.floor(questionDuration / 60);
            const questionDurationSecond = questionDuration % 60;
            const questionDurationString = `${questionDurationMinute}:${questionDurationSecond}`;
            videoChapterDurationArray.push(questionDurationString);
          } else if (index !== 0) {
            const questionDuration = Math.round(
              question.video_interrupt_time -
                video.QuestionData[index - 1].video_interrupt_time
            );
            // remove point and convert to minute:second
            const questionDurationMinute = Math.floor(questionDuration / 60);
            const questionDurationSecond = questionDuration % 60;
            const questionDurationString = `${questionDurationMinute}:${questionDurationSecond}`;
            videoChapterDurationArray.push(questionDurationString);
          }

          // if index is last one
          // if (index === video.QuestionData.length - 1) {
        });
        eachVideoChapterDurationArray.push(videoChapterDurationArray);
      });
      setEachVideoChapterDuration(eachVideoChapterDurationArray);
    }
  }, [originVideoData]);

  if (loading) {
    return (
      <LoadingComponent
        title={(PageTitle ? '測驗用' : '練習用') + '衛教資訊'}
        text={loadingText}
      />
    );
  }
  if (arrayIsEmpty) {
    return (
      <Container>
        <h1 className='text-center'>
          {(PageTitle ? '測驗用' : '練習用') + '衛教資訊'}
        </h1>
        <h2 className='m-3 p-3 text-center'>{`沒有對應的${
          PageTitle ? '測驗用' : '練習用'
        }衛教資訊`}</h2>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className='fw-bold text-center'>{`${
        PageTitle ? '測驗用' : '練習用'
      }衛教資訊`}</h1>
      {originVideoData.map((video, eachQuestionIndex) => {
        return (
          <div key={video.videoCertainID}>
            <div
              type={'button'}
              className={styles.videoListContainer}
              onClick={() => {
                setOpen((prev) => {
                  const copy = [...prev];
                  copy[eachQuestionIndex] = !copy[eachQuestionIndex];
                  return copy;
                });
              }}
            >
              <Container>
                <Row className='align-items-center'>
                  <Col>
                    <Row>
                      <div className='fs-3 m-0'>
                        {eachQuestionIndex + 1 + '. '}
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
                  <Col className='align-items-center' md={5}>
                    {/* <div className='float-end align-items-center'> */}
                    <ProgressBar
                      now={videoProgress}
                      label={`${videoProgress}%`}
                    />
                    {/* </div> */}
                  </Col>

                  {/* <Col className="align-items-center">
                    <div className="float-end align-items-center fs-3">
                      <BiRightArrow />
                    </div>
                  </Col> */}
                </Row>
              </Container>
            </div>
            <Collapse in={open[eachQuestionIndex]}>
              <div id={`collapse-text-${eachQuestionIndex}`}>
                {video.QuestionData.map((question, index) => {
                  return (
                    <Link
                      key={index * 1011}
                      to={'/video/chapter'}
                      state={{
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
                        <div className='fs-5 m-0'>
                          <Container>
                            <Row className='align-items-center'>
                              <Col>
                                <Row>
                                  <div>{`第 ${index + 1} 章`}</div>
                                </Row>
                                <Row>
                                  <div>
                                    {`時長：${eachVideoChapterDuration[eachQuestionIndex][index]}`}
                                  </div>
                                </Row>
                              </Col>
                              {/* <Col>{eachQuestionIndex}</Col> */}
                              {/* <Col>{`時長 ${question[eachQuestionIndex][index]}`}</Col> */}
                            </Row>
                          </Container>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Collapse>
          </div>
        );
      })}
    </Container>
  );
}
