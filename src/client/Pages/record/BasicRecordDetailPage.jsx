import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Row,
  Stack,
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageTitleHeading from "../../../components/PageTitleHeading";
import { convertTimestampToDateOrTime } from "../../../js/dateTimeFormat";
import BtnBootstrap from "../../../components/BtnBootstrap";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdSort } from "react-icons/md";
import "../../../styles/pages/RecordDetailPage.css";

export default function BasicRecordDetailPage() {
  const navigate = useNavigate();
  const { videoName } = useParams();
  const location = useLocation();

  const { videoData } = location.state;

  // filterCondition 為特定篩選條件的陣列，用於存放符合特定名稱的紀錄資料。
  const filterCondition = videoData.filter(
    (item) => item.clientVideoCheck === videoName
  );
  // recordData 是一個特定紀錄的陣列，用於存放符合特定名稱的紀錄資料。
  const [recordData, setRecordData] = useState([]);
  // 依照使用者點選的排序方式，對紀錄資料進行排序。
  const [defaultSort, setDefaultSort] = useState("latestDate");
  // 預設為降序，當使用者點選同一個排序方式時，則改變排序方式。
  const [defaultSortOrder, setDefaultSortOrder] = useState("dsc"); // asc: 升序, dsc: 降序

  /**
   * 當組件掛載時，檢查 `videoData` 是否存在。
   * 如果 `videoData` 不存在，則導航到 "/record/basic" 路由。
   * 如果 `videoData` 存在，則過濾出 `clientVideoCheck` 等於 `videoName` 的項目，
   * 並將結果設置為 `recordData` 的值。
   */
  useEffect(() => {
    if (!videoData) {
      navigate("/record/basic", { replace: true });
    } else {
      setRecordData(
        videoData.filter((item) => item.clientVideoCheck === videoName)
      );
    }
  }, []);

  useEffect(() => {
    if (defaultSort === "latestDate") {
      setRecordData(
        filterCondition.sort((a, b) => {
          if (defaultSortOrder === "asc") {
            return (
              new Date(b.latestQuizDate).getTime() -
              new Date(a.latestQuizDate).getTime()
            );
          } else {
            return (
              new Date(a.latestQuizDate).getTime() -
              new Date(b.latestQuizDate).getTime()
            );
          }
        })
      );
    } else if (defaultSort === "sortScore") {
      setRecordData(
        filterCondition.sort((a, b) => {
          if (defaultSortOrder === "asc") {
            return a.accuracy - b.accuracy;
          } else {
            return b.accuracy - a.accuracy;
          }
        })
      );
    }
  }, [defaultSort, defaultSortOrder]);

  return (
    <>
      <PageTitleHeading text={`${videoName}練習紀錄`} styleOptions={2} />
      <Container>
        <Row>
          <Col className="text-end fs-5 mb-2" role="button">
            <DropdownButton
              align={{ lg: "end" }}
              id={`dropdown-button-drop`}
              //   drop={"down-end"}
              variant="outline-primary rounded-5"
              title={
                <>
                  排序方式
                  <MdSort className="my-auto" />
                </>
              }
            >
              <Dropdown.Item
                eventKey="latestDate"
                onClick={() => {
                  setDefaultSort("latestDate");
                  setDefaultSortOrder("dsc");
                  if (defaultSort === "latestDate") {
                    setDefaultSortOrder(
                      defaultSortOrder === "asc" ? "dsc" : "asc"
                    );
                  }
                }}
                active={defaultSort === "latestDate"}
              >
                最新日期
                {defaultSort === "latestDate" ? (
                  defaultSortOrder === "asc" ? (
                    <FaArrowUp />
                  ) : (
                    <FaArrowDown />
                  )
                ) : null}
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="sortScore"
                onClick={() => {
                  setDefaultSort("sortScore");
                  setDefaultSortOrder("dsc");
                  if (defaultSort === "sortScore") {
                    setDefaultSortOrder(
                      defaultSortOrder === "asc" ? "dsc" : "asc"
                    );
                  }
                }}
                active={defaultSort === "sortScore"}
              >
                分數
                {defaultSort === "sortScore" ? (
                  defaultSortOrder === "asc" ? (
                    <FaArrowUp />
                  ) : (
                    <FaArrowDown />
                  )
                ) : null}
              </Dropdown.Item>
            </DropdownButton>
          </Col>
        </Row>
        {recordData.map((data, index) => {
          const { latestQuizDate, accuracy } = data;
          const formatLatestQuizDate = convertTimestampToDateOrTime(
            latestQuizDate,
            "date"
          );
          const formatLatestQuizTime = convertTimestampToDateOrTime(
            latestQuizDate,
            "time"
          );
          return (
            <Row
              className="mb-2 p-3 border border-2 rounded-3 shadow justify-content-md-center"
              key={`rowButton${index}`}
              role="button"
            >
              <Col className="fs-4">
                {formatLatestQuizDate}
                <br />
                {formatLatestQuizTime}
              </Col>
              <Col className="fs-2 text-end my-auto">
                <b
                  className={accuracy === 100 ? "text-success" : "text-danger"}
                >
                  {accuracy}
                </b>
                分
              </Col>
            </Row>
          );
        })}
        {/* <Modal
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
        </Modal> */}
      </Container>
    </>
  );
}
