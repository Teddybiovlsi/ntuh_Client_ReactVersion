import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Form, Table, Pagination } from 'react-bootstrap';
import { get } from '../axios';
import LoadingComponent from '../../components/LoadingComponent';
import DataSize from '../JSON/slectDataSize.json';

export default function RecordPage({ recordType = 0 }) {
  // 取得當前時間
  // const isoDateInTaipei = GetCurrentDateTime();
  const recordTypeIsPraticeOrTest = recordType === 1 ? '測驗用' : '練習用';
  const recordTypeString = recordTypeIsPraticeOrTest + '紀錄';

  const [loading, setLoading] = useState(false);
  const [totalVideoName, setTotalVideoName] = useState([]);
  const [originDataRecord, setOriginDataRecord] = useState([]);
  const [filteredDataRecord, setFilteredDataRecord] = useState([]);
  const [filteredDataIsNull, setFilteredDataIsNull] = useState(false);

  const [startRecordDate, setStartRecordDate] = useState();
  const [endRecordDate, setEndRecordDate] = useState();
  // 以下是篩選條件
  // 篩選影片名稱
  const [selectVideo, setSelectVideo] = useState('');
  // 篩選完成進度
  const [selectFinishChapter, setSelectFinishChapter] = useState('');
  // 篩選起始日期
  const [startSelectDate, setStartSelectDate] = useState('');
  // 篩選結束日期
  const [endSelectDate, setEndSelectDate] = useState('');
  // 篩選資料筆數
  const [selectDataCount, setSelectDataCount] = useState(5);

  const usrToken = JSON.parse(
    localStorage?.getItem('user') || sessionStorage?.getItem('user')
  )?.client_token;

  useEffect(() => {
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

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      // Handle error if needed
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (originDataRecord.length === 0) return;

    const dates = originDataRecord.map(
      (record) => new Date(record.praticeDate)
    );
    const firstDate = new Date(Math.min(...dates));
    const lastDate = new Date(Math.max(...dates));

    const formatDate = (date) => date.toISOString().split('T')[0];

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
  }, [startSelectDate, selectFinishChapter, endSelectDate, selectVideo]);

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

  const tableBody = (
    <tbody>
      {filteredDataRecord.map((item, index) => {
        const { clientVideoCheck, chapter, answerState, praticeDate } = item;

        const formattedDate = new Date(praticeDate).toLocaleString();

        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{clientVideoCheck}</td>
            <td>{chapter}</td>
            <td>{answerState ? '是' : '否'}</td>
            <td>{formattedDate}</td>
          </tr>
        );
      })}
    </tbody>
  );

  if (loading) return <LoadingComponent title={recordTypeString} />;

  return (
    <Container>
      <Col>
        <Row className='text-center'>
          <h1>{recordTypeString}</h1>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='Form.SelectVideoName'>
              <Form.Label>選擇影片</Form.Label>
              <Form.Select
                aria-label='SelectVideo'
                onChange={(e) => {
                  setSelectVideo(e.target.value);
                }}
              >
                <option value=''>請選擇影片</option>
                {totalVideoName.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='Form.SelectFinishChapter'>
              <Form.Label>完成進度</Form.Label>
              <Form.Select
                aria-label='SelectFinishChapter'
                onChange={(e) => {
                  setSelectFinishChapter(e.target.value);
                }}
              >
                <option value=''>請選擇完成進度</option>
                <option value='true'>已完成</option>
                <option value='false'>未完成</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='Form.StartDate'>
              <Form.Label>起始日期</Form.Label>
              <Form.Control
                type='date'
                name='startDate'
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
            <Form.Group className='mb-3' controlId='Form.EndDate'>
              <Form.Label>結束日期</Form.Label>
              <Form.Control
                type='date'
                name='endDate'
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
          <Col md={6} className='ms-auto'>
            <Form.Select
              aria-label='SelectDataCount'
              onChange={(e) => {
                setSelectDataCount(e.target.value);
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
            <Table striped bordered hover size='sm'>
              {tableHeader}
              {tableBody}
            </Table>
          </Row>
        ) : (
          <Row className='text-center'>
            <h1>該區段查無紀錄資料</h1>
          </Row>
        )}
        <Row>
          <Col md={6} className='mx-auto'>
            <Pagination
              className='justify-content-center'
              size='md'
              aria-label='Page navigation example'
            >
              <Pagination.Prev />
              <Pagination.Item active>{1}</Pagination.Item>
            </Pagination>
          </Col>
        </Row>
      </Col>
      
    </Container>
  );
}
