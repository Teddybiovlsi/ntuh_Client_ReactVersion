import React, { useState } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import { Col, Container, Row } from "react-bootstrap";

export default function BasicRecordPage() {
  const [loading, setLoading] = useState(true);

  if (loading)
    return <LoadingComponent title="基礎練習記錄" text="用戶紀錄載入中" />;

  return (
    <Container>
      <Row>
        <Col></Col>
      </Row>
    </Container>
  );
}
