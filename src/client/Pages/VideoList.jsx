import React from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useEffect } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import { get } from "../axios";
import { Link } from "react-router-dom";
import { MdOutlineArrowForwardIos as BiRightArrow } from "react-icons/md";
import styles from "../../styles/pages/VideoList.module.scss";

export default function VideoList({ PageTitle = 0, loadingText = "Loading" }) {
  const [loading, setLoading] = useState(true);
  const [originVideoData, setOriginVideoData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
  const usrToken = JSON.parse(localStorage?.getItem("user"))?.client_token;
  const usrVideo = JSON.parse(localStorage?.getItem("user"))?.video;

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
      //   filterVideoData with videoType is zero
      const filterVideoData = data.filter(
        (video) => video.videoType === PageTitle
      );

      filterVideoData.length === 0
        ? setArrayIsEmpty(true)
        : setArrayIsEmpty(false);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      // if error.response is true, get error message
      if (error.response) {
        // setErrorMessage(StatusCode(error.response.status));
      }
    }
  };

  if (loading) {
    return (
      <LoadingComponent
        title={(PageTitle ? "測驗用" : "練習用") + "衛教資訊"}
        text={loadingText}
      />
    );
  }
  if (arrayIsEmpty) {
    return (
      <Container>
        <h1 className="text-center">
          {(PageTitle ? "測驗用" : "練習用") + "衛教資訊"}
        </h1>
        <h2 className="m-3 p-3 text-center">{`沒有對應的${
          PageTitle ? "測驗用" : "練習用"
        }衛教資訊`}</h2>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="fw-bold text-center">{`${
        PageTitle ? "測驗用" : "練習用"
      }衛教資訊`}</h1>
      {originVideoData.map((video, index) => {
        return (
          <Link
            to={`/video`}
            state={{
              videoUUID: video.videoCertainID,
              videoPath: video.video_url,
            }}
            className={styles.videoListLink}
          >
            <div key={video.id} className={styles.videoListContainer}>
              <p className="fs-3 m-0">
                {index + 1 + ". "}
                {video.Title}
                <div className="float-end me-2">
                  <BiRightArrow />
                </div>
              </p>
            </div>
          </Link>
        );
      })}
    </Container>
  );
}
