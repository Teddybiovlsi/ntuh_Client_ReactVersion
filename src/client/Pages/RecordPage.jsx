import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Col, Container, Row, Form, Table } from "react-bootstrap";
import { get } from "../axios";
import LoadingComponent from "../../components/LoadingComponent";
import DataSize from "../JSON/slectDataSize.json";
import ReactPaginate from "react-paginate";
import PageTitleHeading from "../../components/PageTitleHeading";

const answerStateArray = [
  { id: 0, name: "回答正確" },
  { id: 1, name: "回答錯誤" },
  { id: 2, name: "未回答" },
  { id: 3, name: "前題錯誤未作答" },
];

export default function RecordPage({ user, recordType = 0 }) {
  // 取得當前時間
  // const isoDateInTaipei = GetCurrentDateTime();
  const recordTypeIsPraticeOrTest = recordType === 1 ? "測驗用" : "練習用";
  const recordTypeString = recordTypeIsPraticeOrTest + "紀錄";

  const [loading, setLoading] = useState(false);
  const [totalVideoName, setTotalVideoName] = useState([]);
  const [originDataRecord, setOriginDataRecord] = useState([]);
  const [filteredDataRecord, setFilteredDataRecord] = useState([]);
  const [filteredDataIsNull, setFilteredDataIsNull] = useState(false);
  const [showDataRecord, setShowDataRecord] = useState([]);

  const [startRecordDate, setStartRecordDate] = useState();
  const [endRecordDate, setEndRecordDate] = useState();
  // 以下是篩選條件
  // 篩選影片名稱
  const [selectVideo, setSelectVideo] = useState("");
  // 篩選完成進度
  const [selectFinishChapter, setSelectFinishChapter] = useState("");
  // 篩選起始日期
  const [startSelectDate, setStartSelectDate] = useState("");
  // 篩選結束日期
  const [endSelectDate, setEndSelectDate] = useState("");
  // 篩選資料筆數
  const [selectDataCount, setSelectDataCount] = useState(5);

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    itemOffset: 0,
    endOffset: selectDataCount,
    currentItems: 0,
    itemsPerPage: 0,
  });

  const updateShowDataRecord = (start, end) => {
    setShowDataRecord(filteredDataRecord.slice(start, end));
  };

  useEffect(() => {
    const { itemOffset, endOffset } = pagination;
    updateShowDataRecord(itemOffset, endOffset);
  }, [filteredDataRecord, pagination]);

  useEffect(() => {
    const rows = filteredDataRecord.length;
    const start = currentPage * selectDataCount;
    const end = start + selectDataCount;
    setPagination((prevPagination) => ({
      ...prevPagination,
      itemsPerPage: Math.ceil(rows / selectDataCount),
      itemOffset: start,
      endOffset: end,
    }));
    updateShowDataRecord(0, selectDataCount);
  }, [filteredDataRecord, selectDataCount]);

  const handlePageClick = useCallback(
    (event) => {
      setCurrentPage(event.selected);
      const start = event.selected * selectDataCount;
      const end = start + selectDataCount;
      setPagination((prevPagination) => ({
        ...prevPagination,
        itemOffset: start,
        endOffset: end,
      }));
    },
    [selectDataCount]
  );

  useEffect(() => {
    const usrToken = user?.client_token;
    setLoading(true);
    handelRecord({ api: `client/record/${usrToken}` });
  }, [recordType]);

  const handelRecord = async ({ api }) => {
    try {
      const res = await get(api);
      const { data, clientVideoName } = res.data;

      const originData = data.filter(
        (item) => item.clientVideoType === recordType
      );

      setOriginDataRecord(originData);
      setFilteredDataRecord(originData);
      setTotalVideoName(clientVideoName);
      updateShowDataRecord(0, selectDataCount);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      // Handle error if needed
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (originDataRecord.length === 0) return;

    const dates = originDataRecord.map(
      (record) => new Date(record.praticeDate)
    );
    const firstDate = new Date(Math.min(...dates));
    const lastDate = new Date(Math.max(...dates));

    const formatDate = (date) => date.toISOString().split("T")[0];

    setStartRecordDate(formatDate(firstDate));
    setEndRecordDate(formatDate(lastDate));
    setStartSelectDate(formatDate(firstDate));
    setEndSelectDate(formatDate(lastDate));
  }, [originDataRecord]);

  useEffect(() => {
    const filterData = () => {
      return originDataRecord.filter((item) => {
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
    };
    setFilteredDataRecord(filterData());
    setPagination((prevPagination) => ({
      ...prevPagination,
      itemsPerPage: Math.ceil(filterData().length / selectDataCount),
    }));
    setCurrentPage(0);
  }, [
    startSelectDate,
    selectFinishChapter,
    endSelectDate,
    selectVideo,
    selectDataCount,
  ]);

  useEffect(() => {
    setFilteredDataIsNull(filteredDataRecord.length === 0);
  }, [filteredDataRecord]);

  const tableHeader = (
    <thead>
      <tr>
        <th>#</th>
        <th>影片名稱</th>
        <th>章節</th>
        <th>是否完成</th>
        <th>作答時間</th>
      </tr>
    </thead>
  );

  const tableBody = useMemo(
    () => (
      <tbody>
        {showDataRecord.map((item, index) => {
          const { clientVideoCheck, chapter, answerState, praticeDate } = item;

          const formattedDate = new Date(praticeDate).toLocaleString();
          const answerStatus = answerStateArray.find(
            (obj) => obj.id === answerState
          );

          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{clientVideoCheck}</td>
              <td>{chapter}</td>
              <td>{answerStatus.name}</td>
              <td>{formattedDate}</td>
            </tr>
          );
        })}
      </tbody>
    ),
    [showDataRecord]
  );

  if (loading)
    return <LoadingComponent title={recordTypeString} text="紀錄資訊載入中" />;

  return (
    <Container>
      <Col>
        <Row className="text-center">
          <PageTitleHeading text={recordTypeString} styleOptions={2} />
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
                <option value="0">回答正確</option>
                <option value="1">回答錯誤</option>
                <option value="2">未回答</option>
                <option value="3">前題錯誤未作答</option>
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
        <Row>
          <Col md={6} className="ms-auto">
            <Form.Select
              aria-label="SelectDataCount"
              onChange={(e) => {
                setSelectDataCount(Number(e.target.value));
              }}
            >
              {DataSize.map((item, index) => (
                <option key={item.id} value={item.value}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        {filteredDataIsNull !== true ? (
          <Row>
            <Table striped bordered hover size="sm">
              {tableHeader}
              {tableBody}
            </Table>
          </Row>
        ) : (
          <Row className="text-center">
            <h1>該區段查無紀錄資料</h1>
          </Row>
        )}
        <Row>
          <Col md={6} className="mx-auto">
            <ReactPaginate
              forcePage={pagination.itemsPerPage > 0 ? currentPage : -1}
              previousLabel={"上一頁"}
              nextLabel={"下一頁"}
              breakLabel={"..."}
              pageCount={pagination.itemsPerPage}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName="justify-content-center pagination"
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </Col>
        </Row>
      </Col>
    </Container>
  );
}
