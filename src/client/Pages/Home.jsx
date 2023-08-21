import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MdOutlineVideoLibrary } from "react-icons/md";
import {
  BsFillBookFill,
  BsTools,
  BsFillQuestionCircleFill,
} from "react-icons/bs";
import { AiFillSetting, AiTwotoneReconciliation } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import styles from "../../styles/pages/HomePage.module.scss";

export default function Home() {
  const navigate = useNavigate();

  const usrName = JSON.parse(localStorage?.getItem("user"));

  const [showChoseVideoModal, setShowChoseVideoModal] = useState(false);
  const handleCloseChoseVideoModal = () => setShowChoseVideoModal(false);

  const [loading, setLoading] = useState(true);

  // if (loading) {
  //   return <LoadingComponent title="" text="使用者資訊載入中" />;
  // }
  return (
    <>
      <Col className="mb-3">
        <Row>
          <Card>
            {/* <Card.Title>{usrName} 您好</Card.Title> */}
            <Card.Body>
              <Card.Text>影片總觀看時間：OO小時OO分鐘</Card.Text>
              <Card.Text>
                完成觀看影片數量(練習用)：OOO
                <Link to={"/pratice"} className="text-decoration-none">
                  [點擊繼續觀看練習用影片]
                </Link>
              </Card.Text>
              <Card.Text>
                完成觀看影片數量(測驗用)：OOO
                <Link to={"/test"} className="text-decoration-none">
                  [點擊繼續觀看測驗用影片]
                </Link>
              </Card.Text>
            </Card.Body>
          </Card>
        </Row>
      </Col>
      <Container>
        <Row>
          <Col sm={2} xs={4}>
            <Link
              type="button"
              className={styles.videoContainer}
              onClick={() => {
                setShowChoseVideoModal(true);
              }}
            >
              <Row>
                <MdOutlineVideoLibrary className="fs-1" />
                <p className="text-center fs-5">衛教資訊</p>
              </Row>
            </Link>
          </Col>
          <Col sm={2} xs={4}>
            <Link to="/" className={styles.infoContainer}>
              <Row>
                <BsFillBookFill className="fs-1" />
                <p className="text-center fs-5">衛教天地</p>
              </Row>
            </Link>
          </Col>
          <Col sm={2} xs={4}>
            <Link to="/" className={styles.recordContainer}>
              <Row>
                <AiTwotoneReconciliation className="fs-1" />
                <p className="text-center fs-5">練習紀錄</p>
              </Row>
            </Link>
          </Col>
          <Col sm={2} xs={4}>
            <Link to="/" className={styles.tutorialContainer}>
              <Row>
                <BsTools className="fs-1" />
                <p className="text-center fs-5">使用教學</p>
              </Row>
            </Link>
          </Col>
          <Col sm={2} xs={4}>
            <Link to="/" className={styles.suggestionContainer}>
              <Row>
                <BsFillQuestionCircleFill className="fs-1" />
                <p className="text-center fs-5">問題建議</p>
              </Row>
            </Link>
          </Col>
          <Col sm={2} xs={4}>
            <Link to="/" className={styles.settingContainer}>
              <Row>
                <AiFillSetting className="fs-1" />
                <p className="text-center fs-5">使用者設定</p>
              </Row>
            </Link>
          </Col>
        </Row>
      </Container>
      {/*  */}
      <Modal show={showChoseVideoModal} onHide={handleCloseChoseVideoModal}>
        <Modal.Header closeButton>
          <Modal.Title>請選擇欲觀看類型</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`d-flex flex-column justify-content-center`}>
            <Link
              to={{
                pathname: "/pratice",
              }}
              className={styles.linkContainer_link}
            >
              <h3 className="mt-1 mb-1">練習用衛教資訊</h3>
            </Link>

            <Link
              to={{
                pathname: "/test",
              }}
              className={styles.linkContainer_link}
            >
              <h3 className="mt-1 mb-1">測驗用衛教資訊</h3>
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
