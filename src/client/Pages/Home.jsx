import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Stack,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { MdOutlineSentimentSatisfiedAlt } from "react-icons/md";
import {
  BsFillBookFill,
  BsTools,
  BsFillQuestionCircleFill,
} from "react-icons/bs";
import { AiFillSetting, AiTwotoneReconciliation } from "react-icons/ai";
import { FaBookReader } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { get } from "../axios";
import useModal from "../../js/useModal";
import { clearUserSession } from "../../js/userAction";
import styles from "../../styles/pages/HomePage.module.scss";
import { handleConvertTime } from "../../js/dateTimeFormat";
/**
 * @param {String} styleOfHeaderBlock 輸入樣式
 * @param {String} styleOfHeaderText 輸入樣式
 * @param {String} text 輸入文字
 * @returns Card.Header
 */
export const CardHeader = ({ styleOfHeaderBlock, styleOfHeaderText, text }) => {
  return (
    <Card.Header className={styleOfHeaderBlock}>
      <h3 className={styleOfHeaderText}>{text}</h3>
    </Card.Header>
  );
};
/**
 *
 * @param {String} text 輸入文字
 * @returns Card.Body
 * @description 用於個人資訊頁面，僅限有帳號的用戶
 */
export const CheckIsClientCardNormalBody = ({ text }) => {
  return (
    <Card.Body>
      <h1 className="text-end py-2">{text}</h1>
    </Card.Body>
  );
};

/**
 * @param {String} text 輸入文字
 * @param {String} dirLink 輸入連結
 * @returns Card.Body
 * @description 用於個人資訊頁面，僅限有帳號的用戶
 */
export const CheckIsClientCardLinkBody = ({ text, dirLink }) => {
  return (
    <Card.Body>
      <h1 className="text-end py-2">
        {text}
        <Link to={dirLink} className={styles.linkCountinuousWatch}>
          繼續觀看
        </Link>
      </h1>
    </Card.Body>
  );
};

/**
 * @returns Card.Body
 * @description 用於個人資訊頁面，訪客顯示用
 */
export const CheckIsGuestCardBody = () => {
  return (
    <Card.Body className={styles.checkIsGuestCardBodyBlock}>
      <h3 className="text-center py-2">
        <FaLock />
        <br />
        權限不足，無法查看
      </h3>
    </Card.Body>
  );
};

export default function Home({ user }) {
  const navigate = useNavigate();

  const permission = user.permission;

  const checkIsClient = permission === "ylhClient" ? true : false;

  const mdSize = permission === "ylhClient" ? 4 : 3;
  const smSize = permission === "ylhClient" ? 4 : 6;
  const xsSize = permission === "ylhClient" ? 4 : 4;

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

  const [
    showLearnStatusModal,
    handleCloseLearnStatusModal,
    handleShowLearnStatusModal,
  ] = useModal();

  const [loading, setLoading] = useState(checkIsClient ? true : false);
  const [error, setError] = useState(null);
  const [usrInfo, setUsrInfo] = useState();

  useEffect(() => {
    if (permission === "ylhClient") {
      const token = user.client_token;
      getUserRecord({
        api: `client/web/record/${token}`,
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
        if (status === 401 && data.message === "請求錯誤") {
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

  return (
    <>
      <Container className="mt-3">
        {/* {checkIsClient && (
          <Row>
            <h3 className="text-primary">個人資訊</h3>
          </Row>
        )}
        {loading === false && checkIsClient ? (
          <Row>
            <Col sm={6} md={6} lg={4}>
              <Card border="primary" className="mb-2">
                <CardHeader
                  styleOfHeaderBlock={styles.cardHeaderOfWatchTimesColor}
                  styleOfHeaderText={styles.cardHeaderText}
                  text="瀏覽影片次數"
                />

                <CheckIsClientCardNormalBody
                  text={`${usrInfo.TotalWatchCount}次`}
                />
              </Card>
            </Col>

            <Col sm={6} md={6} lg={4}>
              <Card border="secondary" className="mb-2">
                <CardHeader
                  styleOfHeaderBlock={styles.cardHeaderOfWatchDurationColor}
                  styleOfHeaderText={styles.cardHeaderText}
                  text="瀏覽影片時間"
                />
                <CheckIsClientCardNormalBody
                  text={handleConvertTime(usrInfo.TotalWatchTime)}
                />
              </Card>
            </Col>
            <Col sm={7} md={6} lg={4}>
              <Card border="danger" className="mb-2">
                <CardHeader
                  styleOfHeaderBlock={styles.cardHeaderOfFinishColor}
                  styleOfHeaderText={styles.cardHeaderText}
                  text="完成基礎練習"
                />

                <CheckIsClientCardLinkBody
                  text={`${usrInfo.TotalFinishBasicVideo}部`}
                  dirLink={"/basic"}
                />
              </Card>
            </Col>
            <Col sm={7} md={6} lg={4}>
              <Card border="warning" className="mb-2">
                <CardHeader
                  styleOfHeaderBlock={styles.cardHeaderOfFinishPraticeColor}
                  styleOfHeaderText={styles.cardHeaderText}
                  text="完成練習"
                />

                <CheckIsClientCardLinkBody
                  text={`${usrInfo.TotalFinishPraticeVideo}部`}
                  dirLink={"/pratice"}
                />
              </Card>
            </Col>
            <Col sm={7} md={6} lg={4}>
              <Card border="success" className="mb-2">
                <CardHeader
                  styleOfHeaderBlock={styles.cardHeaderOfFinishTestColor}
                  styleOfHeaderText={styles.cardHeaderText}
                  text="完成測驗"
                />

                <CheckIsClientCardLinkBody
                  text={`${usrInfo.TotalFinishTestVideo}部`}
                  dirLink={"/test"}
                />
              </Card>
            </Col>
          </Row>
        ) : (
          checkIsClient && (
            <Card.Body>
              <Card.Text>用戶資訊載入中</Card.Text>
            </Card.Body>
          )
        )} */}
      </Container>
      <Container className="pb-4 my-4">
        <Card className={`py-4 ${styles.container_CardContainer}`}>
          <Row>
            <Col
              md={mdSize}
              sm={smSize}
              xs={xsSize}
              className="text-center my-3"
            >
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
            <Col
              md={mdSize}
              sm={smSize}
              xs={xsSize}
              className="text-center  my-3"
            >
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
              <Col
                md={mdSize}
                sm={smSize}
                xs={xsSize}
                className="text-center  my-3"
              >
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
            <Col
              md={mdSize}
              sm={smSize}
              xs={xsSize}
              className="text-center  my-3"
            >
              <Link to="/usingTip" className={styles.tutorialContainer}>
                <Row>
                  <BsTools className="fs-1" />
                  <p className="text-center fs-5 my-auto">使用教學</p>
                </Row>
              </Link>
            </Col>
            <Col
              md={mdSize}
              sm={smSize}
              xs={xsSize}
              className="text-center  my-3"
            >
              <Link to="/comment" className={styles.suggestionContainer}>
                <Row>
                  <MdOutlineSentimentSatisfiedAlt className="fs-1" />
                  <p className="text-center fs-5 my-auto">滿意度調查</p>
                </Row>
              </Link>
            </Col>
            {permission === "ylhClient" && (
              <Col
                md={mdSize}
                sm={smSize}
                xs={xsSize}
                className="text-center  my-3"
              >
                <Link to="/setting" className={styles.settingContainer}>
                  <Row>
                    <AiFillSetting className="fs-1" />
                    <p className="text-center fs-5">設定</p>
                  </Row>
                </Link>
              </Col>
            )}
          </Row>
          {permission === "ylhClient" && (
            <Button
              variant="outline-primary"
              className={styles.learnStatusContainer}
              onClick={handleShowLearnStatusModal}
            >
              <p className="text-center fs-3 m-0">
                <FaBookReader />
                學習狀態
              </p>
            </Button>
          )}
        </Card>
      </Container>
      {/* 選擇衛教影音類型：基礎／練習／測驗 */}
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
      {/* 學習狀態Modal */}
      <Modal show={showLearnStatusModal} onHide={handleCloseLearnStatusModal}>
        <Modal.Header closeButton>
          <Modal.Title>學習狀態</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading === false && checkIsClient ? (
            <Container>
              <Row>
                <Col>
                  <h5>瀏覽影片次數</h5>
                  <p>{usrInfo.TotalWatchCount}次</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h5>瀏覽影片時間</h5>
                  <p>{handleConvertTime(usrInfo.TotalWatchTime)}</p>
                </Col>
              </Row>
            </Container>
          ) : (
            <p>用戶資訊載入中</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
