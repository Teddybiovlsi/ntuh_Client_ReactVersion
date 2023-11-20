import React, { useEffect, useState } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import { Accordion, Col, Container, Modal, Row } from "react-bootstrap";
import { getUserSession } from "../../js/userAction";
import { convertTimestampToDateOrTime } from "../../js/dateTimeFormat";
import { get } from "../axios";
import PageTitleHeading from "../../components/PageTitleHeading";
import BtnBootstrap from "../../components/BtnBootstrap";
import { useNavigate } from "react-router-dom";

export default function BasicRecordListPage() {
  const user = getUserSession();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [originDataRecord, setOriginDataRecord] = useState([]);
  const [filteredDataRecord, setFilteredDataRecord] = useState([]);
  const [totalVideoName, setTotalVideoName] = useState([]);
  const [finshWatch, setFinshWatch] = useState([]);
  const [haveQuiz, setHaveQuiz] = useState([]);

  const [calEachTotalPratice, setCalEachTotalPratice] = useState([]);
  const [calEachTotalLatestDate, setCalEachTotalLatestDate] = useState([]);
  const [calEachHighestAccuracy, setCalEachHighestAccuracy] = useState([]);

  useEffect(() => {
    const usrToken = user?.client_token;

    handelRecord({
      api: `client/basicRecord/${usrToken}`,
    });
  }, []);

  const handelRecord = async ({ api }) => {
    try {
      const res = await get(api);
      const {
        data,
        clientVideoName,
        clientCheckVideoFinshWatch,
        clientCheckVideoHaveQuiz,
      } = res.data;

      setOriginDataRecord(data);
      setTotalVideoName(clientVideoName);
      setFinshWatch(clientCheckVideoFinshWatch);
      setHaveQuiz(clientCheckVideoHaveQuiz);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (originDataRecord.length > 0) {
      const calEachTotalPratice = [];
      const calEachTotalLatestDate = [];
      const calEachHighestAccuracy = [];

      totalVideoName.forEach((videoName) => {
        const filteredData = originDataRecord.filter(
          (item) => item.clientVideoCheck === videoName
        );

        const eachTotalPratice = filteredData.length;

        const eachLatestDate =
          filteredData.length > 0
            ? convertTimestampToDateOrTime(
                Math.max(
                  ...filteredData.map((item) =>
                    new Date(item.latestQuizDate).getTime()
                  )
                ),
                "date"
              )
            : "查無對應最新日期";

        const eachHighestAccuracy =
          filteredData.length > 0
            ? Math.max(...filteredData.map((item) => item.accuracy))
            : "目前無分數";

        calEachTotalPratice.push(eachTotalPratice);
        calEachTotalLatestDate.push(eachLatestDate);
        calEachHighestAccuracy.push(eachHighestAccuracy);
      });

      // setCalEachTotalPratice(calEachTotalPratice);
      setCalEachTotalLatestDate(calEachTotalLatestDate);
      setCalEachHighestAccuracy(calEachHighestAccuracy);
    }
  }, [originDataRecord]);

  if (loading)
    return <LoadingComponent title="基礎練習記錄" text="用戶紀錄載入中" />;

  return (
    <>
      <PageTitleHeading text="基礎練習紀錄" styleOptions={2} />
      <Container>
        {totalVideoName.length > 0 ? (
          totalVideoName.map((videoName, index) => {
            return (
              <Row
                // role="button"
                className={`mb-2 p-3 border border-2 rounded-3 shadow justify-content-md-center`}
                key={`rowContainer${index}`}
              >
                <Col md={6} className="my-auto">
                  <p className="fs-5 m-0" title={videoName}>
                    影片名稱：
                    {videoName.length > 5
                      ? videoName.slice(0, 5) + "..."
                      : videoName}
                  </p>
                </Col>

                <Col md={6} className="my-auto">
                  <p className="m-0 fs-5">
                    完成觀看：
                    <b
                      className={` ${
                        finshWatch[index] ? "text-success" : "text-danger "
                      }`}
                    >
                      {finshWatch[index] ? "完成" : "未完成"}
                    </b>
                  </p>
                </Col>
                {haveQuiz[index] && (
                  <>
                    <Col md={6} className="my-auto">
                      <p className="m-0 fs-5">
                        分數：
                        <b
                          className={` ${
                            calEachHighestAccuracy[index] < 100 ||
                            calEachHighestAccuracy[index] === "目前無分數"
                              ? "text-danger "
                              : "text-success"
                          }`}
                        >
                          {calEachHighestAccuracy[index]}
                        </b>
                      </p>
                    </Col>
                    <Col md={6} className="my-auto">
                      <p className="fs-5 m-0">
                        最後測驗日期：
                        <b
                          className={`${
                            calEachTotalLatestDate[index] ===
                              "查無對應最新日期" && "text-danger"
                          }`}
                        >
                          {calEachTotalLatestDate[index]}
                        </b>
                      </p>
                    </Col>
                  </>
                )}

                {calEachHighestAccuracy[index] !== "目前無分數" && (
                  <BtnBootstrap
                    btnPosition="my-2"
                    btnSize="md"
                    onClickEventName={() => {
                      navigate("/record/basic/" + videoName, {
                        state: {
                          videoData: originDataRecord,
                        },
                      });
                    }}
                    variant="outline-primary"
                    title="閱讀更多"
                    text="閱讀更多"
                  />
                )}
              </Row>
            );
          })
        ) : (
          <Col>
            <p>目前尚未有任何紀錄</p>
          </Col>
        )}
      </Container>
    </>
  );
}
