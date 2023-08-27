import React from 'react';
import { Col, Container, Row, Form, Table } from 'react-bootstrap';

export default function RecordPage() {
  const dataVideo = [
    {
      id: 1,
      title: '翻身',
    },
    {
      id: 2,
      title: '翻身百',
    },
    {
      id: 3,
      title: '翻身百科',
    },
  ];
  const dataRecord = [
    {
      id: 1,
      title: '翻身',
      chacpter: '第四章',
      finsh: true,
      date: '2021-09-01',
    },
    {
      id: 2,
      title: '翻身',
      chacpter: '第五章',
      finsh: false,
      date: '2021-09-02',
    },
  ];
  return (
    <Container>
      <Col>
        <Row className='text-center'>
          <h1>RecordPage</h1>
        </Row>
        <Row></Row>
        <Row>
          <Col md={6}>
            <Form.Select aria-label='SelectVideo'>
              <option>請選擇影片</option>
              {dataVideo.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='Form.StartDate'>
              <Form.Label>起始日期</Form.Label>
              <Form.Control type='date' />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3' controlId='Form.EndDate'>
              <Form.Label>結束日期</Form.Label>
              <Form.Control type='date' />
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
              {dataRecord.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.chacpter}</td>
                  <td>{item.finsh ? '是' : '否'}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Col>
    </Container>
  );
}
