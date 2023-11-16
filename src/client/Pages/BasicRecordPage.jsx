import React, { useEffect, useState } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import { Accordion, Col, Container, Modal, Row } from "react-bootstrap";
import { getUserSession } from "../../js/userAction";
import { get } from "../axios";
import PageTitleHeading from "../../components/PageTitleHeading";
import { MdReadMore } from "react-icons/md";

export default function BasicRecordPage() {
  const user = getUserSession();

  const [loading, setLoading] = useState(true);

  const [originDataRecord, setOriginDataRecord] = useState([]);
  const [filteredDataRecord, setFilteredDataRecord] = useState([]);
  const [totalVideoName, setTotalVideoName] = useState([]);

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

  if (loading)
    return <LoadingComponent title="基礎練習記錄" text="用戶紀錄載入中" />;

  return (
    <Container>
      <Row className="text-center">
        <PageTitleHeading text="基礎練習紀錄" styleOptions={2} />
      </Row>
      <Row>
        {filteredDataRecord.length > 0 ? (
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
        )}
      </Row>
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
                          recordProfile.isValid ? "text-success" : "text-danger"
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
  );
}
