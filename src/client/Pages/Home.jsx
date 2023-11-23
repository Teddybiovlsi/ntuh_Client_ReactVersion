import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Modal, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MdOutlineVideoLibrary } from "react-icons/md";
import {
  BsFillBookFill,
  BsTools,
  BsFillQuestionCircleFill,
} from "react-icons/bs";
import { AiFillSetting, AiTwotoneReconciliation } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { get } from "../axios";
import useModal from "../../js/useModal";
import { clearUserSession, getUserSession } from "../../js/userAction";
import styles from "../../styles/pages/HomePage.module.scss";

export default function Home() {
  const navigate = useNavigate();

  const user = getUserSession();

  const permission = user.permission;

  const smSize = permission === "ylhClient" ? 2 : 3;
  const xsSize = permission === "ylhClient" ? 4 : 6;

  const [
    showChoseVideoModal,
    handleCloseChoseVideoModal,
    handleShowChoseVideoModal,
  ] = useModal();
  const [
    showChoseRecordModal,
    handleCloseChoseRecordModal,
    handleShowChoseRecordModal,
  ] = useModal();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usrInfo, setUsrInfo] = useState();

  useEffect(() => {
    if (permission === "ylhClient") {
      getUserRecord({
        api: `client/web/record/${user.client_token}`,
      });
    }
  }, []);

  const getUserRecord = async ({ api }) => {
    try {
      const res = await get(api);
      setUsrInfo(res.data);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 404 && data.message === "請求錯誤") {
          handleSessionTimeout();
        } else {
          setError(data.message);
          setLoading(false);
        }
      } else {
        // 處理非 API 回應的錯誤
        // ...
      }
    }
  };

  const handleSessionTimeout = () => {
    alert("登入逾時，請重新登入");
    clearUserSession();
    navigate("/");
  };

  useEffect(() => {
    if (user === null) {
      clearUserSession();
      navigate("/");
    }
  }, []);

  const handleConvertTime = (time) => {
    const hour = Math.floor(time / 3600);
    const minute = Math.floor((time % 3600) / 60);
    const second = Math.floor((time % 3600) % 60);
    return `${hour}小時${minute}分鐘${second}秒`;
  };

  return (
    <>
      {permission === "ylhClient" && (
        <Col className="mb-3">
          <Row>
            <Card>
              <Card.Title>{user.client_name} 您好</Card.Title>
              {loading === false ? (
                <Card.Body>
                  {error ? (
                    <Card.Text>查無用戶當前練習紀錄</Card.Text>
                  ) : (
                    <>
                      <Card.Text>
                        總瀏覽影片次數：{usrInfo.TotalWatchCount}次
                      </Card.Text>
                      <Card.Text>
                        影片總觀看時間：
                        {handleConvertTime(usrInfo.TotalWatchTime)}
                      </Card.Text>
                      <Card.Text>完成觀看影片數量：</Card.Text>
                      <Card.Text className="ms-3">
                        基礎練習用：
                        {usrInfo.TotalFinishBasicVideo}部
                        <Link to={"/basic"} className="text-decoration-none">
                          [點擊繼續觀看]
                        </Link>
                      </Card.Text>
                      <Card.Text className="ms-3">
                        練習用：
                        {usrInfo.TotalFinishPraticeVideo}部
                        <Link to={"/pratice"} className="text-decoration-none">
                          [點擊繼續觀看]
                        </Link>
                      </Card.Text>
                      <Card.Text className="ms-3">
                        測驗用：
                        {usrInfo.TotalFinishTestVideo}部
                        <Link to={"/test"} className="text-decoration-none">
                          [點擊繼續觀看]
                        </Link>
                      </Card.Text>
                    </>
                  )}
                </Card.Body>
              ) : (
                <Card.Body>
                  <Card.Text>用戶資訊載入中</Card.Text>
                </Card.Body>
              )}
            </Card>
          </Row>
        </Col>
      )}
      {/* {permission === 'ylhGuest' && (
        <Col>
          <Row>
            <Card className={`${styles.personalRecordContainer} mb-3`}>
              <Card.Title>您好</Card.Title>
              <Card.Body>
                <Card.Text>歡迎使用臺大醫院雲林分院系統</Card.Text>
              </Card.Body>
            </Card>
          </Row>
        </Col>
      )} */}
      <Container>
        <Row>
          <Col sm={smSize} xs={xsSize} className="my-auto mx-auto">
            <Link
              type="button"
              className={styles.videoContainer}
              onClick={handleShowChoseVideoModal}
            >
              <Row className="mx-auto my-auto">
                <MdOutlineVideoLibrary className="fs-1" />
                <p className="text-center fs-5 my-auto">衛教資訊</p>
              </Row>
            </Link>
          </Col>
          <Col sm={smSize} xs={xsSize}>
            <Link
              to={"https://www.ylh.gov.tw/?aid=612"}
              className={styles.infoContainer}
            >
              <Row>
                <BsFillBookFill className="fs-1" />
                <p className="text-center fs-5 my-auto">衛教天地</p>
              </Row>
            </Link>
          </Col>
          {permission === "ylhClient" && (
            <Col sm={smSize} xs={xsSize}>
              <Link
                type="button"
                className={styles.recordContainer}
                onClick={handleShowChoseRecordModal}
              >
                <Row>
                  <AiTwotoneReconciliation className="fs-1" />
                  <p className="text-center fs-5 my-auto">練習紀錄</p>
                </Row>
              </Link>
            </Col>
          )}
          <Col sm={smSize} xs={xsSize}>
            <Link to="/usingTip" className={styles.tutorialContainer}>
              <Row>
                <BsTools className="fs-1" />
                <p className="text-center fs-5 my-auto">使用教學</p>
              </Row>
            </Link>
          </Col>
          <Col sm={smSize} xs={xsSize}>
            <Link to="/comment" className={styles.suggestionContainer}>
              <Row>
                <BsFillQuestionCircleFill className="fs-1" />
                <p className="text-center fs-5 my-auto">問題建議</p>
              </Row>
            </Link>
          </Col>
          {permission === "ylhClient" && (
            <Col sm={smSize} xs={xsSize}>
              <Link to="/setting" className={styles.settingContainer}>
                <Row>
                  <AiFillSetting className="fs-1" />
                  <p className="text-center fs-5">使用者設定</p>
                </Row>
              </Link>
            </Col>
          )}
        </Row>
      </Container>
      {/*  */}
      <Modal show={showChoseVideoModal} onHide={handleCloseChoseVideoModal}>
        <Modal.Header closeButton>
          <Modal.Title>請選擇欲觀看類型</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={1}>
            {/* 基礎練習用 */}
            <Link
              to={{
                pathname: "/basic",
              }}
              className={styles.linkContainer_link}
            >
              <h3 className="mt-1 mb-1">基本練習</h3>
            </Link>
            {/* 練習用 */}
            <Link
              to={{
                pathname: "/pratice",
              }}
              className={styles.linkContainer_link}
            >
              <h3 className="mt-1 mb-1">練習</h3>
            </Link>
            {/* 測驗用 */}
            <Link
              to={{
                pathname: "/test",
              }}
              className={styles.linkContainer_link}
            >
              <h3 className="mt-1 mb-1">測驗</h3>
            </Link>
          </Stack>
        </Modal.Body>
      </Modal>
      {/* 練習紀錄Modal */}
      <Modal show={showChoseRecordModal} onHide={handleCloseChoseRecordModal}>
        <Modal.Header closeButton>
          <Modal.Title>請選擇欲觀看類型</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`d-flex flex-column justify-content-center`}>
            <Link
              to={{
                pathname: "/record/pratice",
              }}
              className={styles.linkContainer_link}
            >
              <h3 className="mt-1 mb-1">練習用衛教紀錄</h3>
            </Link>

            <Link
              to={{
                pathname: "/record/test",
              }}
              className={styles.linkContainer_link}
            >
              <h3 className="mt-1 mb-1">測驗用衛教紀錄</h3>
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
