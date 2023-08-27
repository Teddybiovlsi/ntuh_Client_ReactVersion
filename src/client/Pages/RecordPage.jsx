import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Form, Table } from 'react-bootstrap';
import { get } from '../axios';
import LoadingComponent from '../../components/LoadingComponent';

export default function RecordPage() {
  const [loading, setLoading] = useState(false);
  const [dataRecord, setDataRecord] = useState([]);
  const usrToken = JSON.parse(localStorage?.getItem('user'))?.client_token;



  function formatDateToISODate(year, month, day) {
    const formattedMonth = (month < 10) ? `${month}` : month;
    const formattedDay = (day < 10) ? `${day}` : day;
    return `${year}-${formattedMonth}-${formattedDay}`;
  }
  
  const options = { timeZone: 'Asia/Taipei' };
  const currentDate = new Date();
  
  const taipeiYear = currentDate.toLocaleDateString('en-US', { ...options, year: 'numeric' });
  const taipeiMonth = currentDate.toLocaleDateString('en-US', { ...options, month: '2-digit' });
  const taipeiDay = currentDate.toLocaleDateString('en-US', { ...options, day: '2-digit' });
  
  const isoDateInTaipei = formatDateToISODate(taipeiYear, taipeiMonth, taipeiDay);
  console.log(isoDateInTaipei);

  const handelRecord = async ({ api }) => {
    const res = await get(api);
    // check the data type
    const data = res.data.data;
    setDataRecord(data);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };
  useEffect(() => {
    setLoading(true);
    handelRecord({ api: `client/record/${usrToken}` });
  }, []);

  //   useEffect(() => {
  //     console.log(dataRecord.data);
  //   }, [dataRecord]);

  //   useEffect(() => {

  if (loading) return <LoadingComponent title='載入紀錄中請稍後' />;

  return (
    <Container>
      <Col>
        <Row className='text-center'>
          <h1>RecordPage</h1>
        </Row>
        <Row></Row>
        <Row>
          <Col md={6}>
            {/* <Form.Select aria-label='SelectVideo'>
              <option>請選擇影片</option>
              {dataVideo.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </Form.Select> */}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='Form.StartDate'>
              <Form.Label>起始日期</Form.Label>
              <Form.Control
                type='date'
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='Form.EndDate'>
              <Form.Label>結束日期</Form.Label>
              <Form.Control
                type='date'
                name='endDate'
                max={isoDateInTaipei}
                value={isoDateInTaipei}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Table striped bordered hover size='sm'>
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
              {dataRecord.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.clientVideoCheck}</td>
                    <td>{item.chapter}</td>
                    <td>{item.answerState == 'true' ? '是' : '否'}</td>
                    <td>
                      {new Date(item.praticeDate).toLocaleDateString() +
                        ' ' +
                        new Date(item.praticeDate).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
      </Col>
    </Container>
  );
}
