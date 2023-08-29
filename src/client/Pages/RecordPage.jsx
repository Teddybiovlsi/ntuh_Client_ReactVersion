import React, { useEffect, useState } from "react";
import { Col, Container, Row, Form, Table } from "react-bootstrap";
import { get } from "../axios";
import LoadingComponent from "../../components/LoadingComponent";

export default function RecordPage({
  recordType = 0,
  currentCity = "Asia/Taipei",
}) {
  // 取得當前時間
  // const isoDateInTaipei = GetCurrentDateTime();
  const recordTypeIsPraticeOrTest = recordType === 1 ? "測驗用" : "練習用";

  const [loading, setLoading] = useState(false);
  const [totalVideoName, setTotalVideoName] = useState([]);
  const [originDataRecord, setOriginDataRecord] = useState([]);
  const [filteredDataRecord, setFilteredDataRecord] = useState([]);
  const [filteredDataIsNull, setFilteredDataIsNull] = useState(false);

  const [startRecordDate, setStartRecordDate] = useState();
  const [endRecordDate, setEndRecordDate] = useState();

  const [selectVideo, setSelectVideo] = useState("");
  const [selectFinishChapter, setSelectFinishChapter] = useState("");
  const [startSelectDate, setStartSelectDate] = useState("");
  const [endSelectDate, setEndSelectDate] = useState("");

  const usrToken = JSON.parse(localStorage?.getItem("user"))?.client_token;

  useEffect(() => {
    setLoading(true);
    handelRecord({ api: `client/record/${usrToken}` });
  }, [recordType]);

  const handelRecord = async ({ api }) => {
    const res = await get(api);
    // check the data type
    const data = res.data.data;
    const videoName = res.data.clientVideoName;

    setOriginDataRecord(data);
    setFilteredDataRecord(data);

    setTotalVideoName(videoName);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  useEffect(() => {
    if (originDataRecord.length === 0) return;

    let firstDate = originDataRecord[0].praticeDate;
    let lastDate = originDataRecord[0].praticeDate;

    for (var i = 0; i < originDataRecord.length; i++) {
      const currentDate = originDataRecord[i].praticeDate;
      if (currentDate < firstDate) {
        firstDate = currentDate;
      }
      if (currentDate > lastDate) {
        lastDate = currentDate;
      }
    }

    const firstDateISO = new Date(firstDate).toISOString().split("T")[0];
    const lastDateISO = new Date(lastDate).toISOString().split("T")[0];

    setStartRecordDate(firstDateISO);
    setEndRecordDate(lastDateISO);
    setStartSelectDate(firstDateISO);
    setEndSelectDate(lastDateISO);
  }, [originDataRecord]);

  useEffect(() => {
    const filteredData = originDataRecord.filter((item) => {
      const recordDate = new Date(item.praticeDate);
      const endDate = new Date(endSelectDate);
      endDate.setDate(endDate.getDate() + 1);

      const isDateInRange =
        recordDate >= new Date(startSelectDate) && recordDate <= endDate;
      const isVideoMatch =
        !selectVideo || item.clientVideoCheck === selectVideo;
      const isChapterMatch =
        !selectFinishChapter ||
        item.answerState === JSON.parse(selectFinishChapter);

      return isDateInRange && isVideoMatch && isChapterMatch;
    });

    setFilteredDataRecord(filteredData);
  }, [startSelectDate, selectFinishChapter, endSelectDate, selectVideo]);

  useEffect(() => {
    if (filteredDataRecord.length === 0) setFilteredDataIsNull(true);
    else setFilteredDataIsNull(false);
  }, [filteredDataRecord]);

  if (loading)
    return <LoadingComponent title={`${recordTypeIsPraticeOrTest}紀錄`} />;

  return (
    <Container>
      <Col>
        <Row className="text-center">
          <h1>{`${recordTypeIsPraticeOrTest}紀錄`}</h1>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="Form.SelectVideoName">
              <Form.Label>選擇影片</Form.Label>
              <Form.Select
                aria-label="SelectVideo"
                onChange={(e) => {
                  setSelectVideo(e.target.value);
                }}
              >
                <option value="">請選擇影片</option>
                {totalVideoName.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="Form.SelectFinishChapter">
              <Form.Label>完成進度</Form.Label>
              <Form.Select
                aria-label="SelectFinishChapter"
                onChange={(e) => {
                  setSelectFinishChapter(e.target.value);
                }}
              >
                <option value="">請選擇完成進度</option>
                <option value="true">已完成</option>
                <option value="false">未完成</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="Form.StartDate">
              <Form.Label>起始日期</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                onChange={(e) => {
                  setStartSelectDate(e.target.value);
                }}
                min={startRecordDate}
                max={endRecordDate}
                value={startSelectDate ? startSelectDate : startRecordDate}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="Form.EndDate">
              <Form.Label>結束日期</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                onChange={(e) => {
                  setEndSelectDate(e.target.value);
                }}
                min={startRecordDate}
                max={endRecordDate}
                value={endSelectDate ? endSelectDate : endRecordDate}
              />
            </Form.Group>
          </Col>
        </Row>
        {filteredDataIsNull !== true ? (
          <Row>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>影片名稱</th>
                  <th>章節</th>
                  <th>是否完成</th>
                  <th>作答時間</th>
                </tr>
              </thead>
              <tbody>
                {filteredDataRecord.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.clientVideoCheck}</td>
                      <td>{item.chapter}</td>
                      <td>{item.answerState == true ? "是" : "否"}</td>
                      <td>
                        {new Date(item.praticeDate).toLocaleDateString() +
                          " " +
                          new Date(item.praticeDate).toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Row>
        ) : (
          <Row className="text-center">
            <h1>該區段查無紀錄資料</h1>
          </Row>
        )}
      </Col>
    </Container>
  );
}
