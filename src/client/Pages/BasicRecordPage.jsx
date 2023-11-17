import React, { useEffect, useState } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import { Accordion, Col, Container, Modal, Row } from "react-bootstrap";
import { getUserSession } from "../../js/userAction";
import { get } from "../axios";
import PageTitleHeading from "../../components/PageTitleHeading";
import BtnBootstrap from "../../components/BtnBootstrap";

export default function BasicRecordPage() {
  const user = getUserSession();

  const [loading, setLoading] = useState(true);

  const [originDataRecord, setOriginDataRecord] = useState([]);
  const [filteredDataRecord, setFilteredDataRecord] = useState([]);
  const [totalVideoName, setTotalVideoName] = useState([]);

  const [calEachTotalPratice, setCalEachTotalPratice] = useState([]);
  const [calEachTotalLatestDate, setCalEachTotalLatestDate] = useState([]);
  const [calEachHighestAccuracy, setCalEachHighestAccuracy] = useState([]);

  const [recordProfile, setRecordProfile] = useState(null);

  useEffect(() => {
    const usrToken = user?.client_token;

    handelRecord({
      api: `client/basicRecord/${usrToken}`,
    });
  }, []);

  const handelRecord = async ({ api }) => {
    try {
      const res = await get(api);
      const { data, clientVideoName } = res.data;

      setOriginDataRecord(data);
      setFilteredDataRecord(data);
      setTotalVideoName(clientVideoName);
      // updateShowDataRecord(0, selectDataCount);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      // Handle error if needed
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
            ? new Date(
                Math.max(
                  ...filteredData.map((item) =>
                    new Date(item.latestQuizDate).getTime()
                  )
                )
              ).toLocaleString()
            : "查無對應最新日期";

        const eachHighestAccuracy =
          filteredData.length > 0
            ? Math.max(...filteredData.map((item) => item.accuracy))
            : "目前無分數";

        calEachTotalPratice.push(eachTotalPratice);
        calEachTotalLatestDate.push(eachLatestDate);
        calEachHighestAccuracy.push(eachHighestAccuracy);
      });

      setCalEachTotalPratice(calEachTotalPratice);
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
                key={`rowButton${index}`}
              >
                <Col md={6} className="my-auto">
                  <p className="fs-5 m-0" title={videoName}>
                    影片名稱：
                    {videoName.length > 5
                      ? videoName.slice(0, 5) + "..."
                      : videoName}
                  </p>
                </Col>

                <Col
                  // xs={calEachHighestAccuracy[index] === "目前無分數" ? 12 : 12}
                  md={6}
                  className="my-auto"
                >
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
                <p className="fs-5 m-0">
                  最新日期：
                  <b
                    className={`${
                      calEachTotalLatestDate[index] === "查無對應最新日期" &&
                      "text-danger"
                    }`}
                  >
                    {calEachTotalLatestDate[index]}
                  </b>
                </p>
                {calEachHighestAccuracy[index] !== "目前無分數" && (
                  <BtnBootstrap
                    btnSize="md"
                    onClickEventName={() => {}}
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

        {/* {filteredDataRecord.length > 0 ? (
    filteredDataRecord.map((item, index) => {
      const { accuracy, clientVideoCheck, latestQuizDate } = item;

      const formattedDate = new Date(latestQuizDate).toLocaleDateString();

      return (
        <Row
          // role="button"
          className={`mb-2 p-3 border border-2 rounded-3 shadow `}
          key={`rowButton${index}`}
        >
          <Col xs={8}>
            <h2>{clientVideoCheck}</h2>
            <p className="m-0">{formattedDate}</p>
          </Col>
          <Col xs={2} className="my-auto">
            <p
              className={`m-0 fs-3 text-center ${
                accuracy < 100 ? "text-danger" : "text-success"
              }`}
            >
              {accuracy}
            </p>
          </Col>
          <Col
            xs={2}
            className="my-auto fs-1"
            role="button"
            onClick={() => {
              setRecordProfile(item.eachQuizAnswerContent);
            }}
          >
            <MdReadMore />
          </Col>
        </Row>
      );
    })
  ) : (
    <Col>
      <p>目前尚未有任何紀錄</p>
    </Col>
  )} */}
        <Modal
          show={recordProfile !== null}
          onHide={() => {
            setRecordProfile(null);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>作答情形</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Accordion>
              {recordProfile &&
                recordProfile.map((recordProfile, index) => {
                  return (
                    <Accordion.Item eventKey={recordProfile.questionContent}>
                      <Accordion.Header>
                        <b
                          className={
                            recordProfile.isValid
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          問題：{recordProfile.questionContent}
                        </b>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Container>
                          <Row>
                            <p>
                              <b className="text-primary">作答內容:</b>
                              {recordProfile.responseContent}
                            </p>
                          </Row>
                          <Row>
                            <p>
                              <b className="text-primary">是否正確:</b>
                              <b
                                className={
                                  recordProfile.isValid
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                {recordProfile.isValid ? "正確" : "錯誤"}
                              </b>
                            </p>
                          </Row>
                          {recordProfile.isValid === false && (
                            <Row>
                              <p>
                                <b className="text-primary">正確答案:</b>
                                <b className="text-success">
                                  {recordProfile.correctAnswer}
                                </b>
                              </p>
                            </Row>
                          )}
                        </Container>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
            </Accordion>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
