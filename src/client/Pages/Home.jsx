import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MdOutlineVideoLibrary } from 'react-icons/md';
import {
  BsFillBookFill,
  BsTools,
  BsFillQuestionCircleFill,
} from 'react-icons/bs';
import { AiFillSetting, AiTwotoneReconciliation } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../components/LoadingComponent';
import styles from '../../styles/pages/HomePage.module.scss';
import Loading from '../../components/Loading';
import { get } from '../axios';

export default function Home() {
  const navigate = useNavigate();

  const usrName = JSON.parse(
    localStorage?.getItem('user') || sessionStorage?.getItem('user')
  );

  const [showChoseVideoModal, setShowChoseVideoModal] = useState(false);
  const handleCloseChoseVideoModal = () => setShowChoseVideoModal(false);

  const [showChoseRecordModal, setShowChoseRecordModal] = useState(false);
  const handleCloseChoseRecordModal = () => setShowChoseRecordModal(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usrInfo, setUsrInfo] = useState();

  useEffect(() => {
    getUserRecord({
      api: `client/web/record/${usrName.client_token}`,
    });
  }, []);

  const getUserRecord = async ({ api }) => {
    try {
      const res = await get(api);
      setUsrInfo(res.data);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (err) {
      if (
        err.response.status === 404 &&
        err.response.data.message === '請求錯誤'
      ) {
        alert('登入逾時，請重新登入');
        localStorage.clear();
        navigate('/');
        return;
      } else {
        setError(err.response.data.message);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (usrName === null) {
      localStorage.clear();
      navigate('/');
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
      <Col className='mb-3'>
        <Row>
          <Card>
            <Card.Title>{usrName.client_name} 您好</Card.Title>
            {loading === false ? (
              <Card.Body>
                {error ? (
                  <Card.Text>查無用戶當前練習紀錄</Card.Text>
                ) : (
                  <>
                    <Card.Text>
                      影片總觀看時間：
                      {handleConvertTime(usrInfo.TotalWatchTime)}
                    </Card.Text>
                    <Card.Text>
                      完成觀看影片數量(練習用)：
                      {usrInfo.TotalFinishPraticeVideo}部
                      <Link to={'/pratice'} className='text-decoration-none'>
                        [點擊繼續觀看練習用影片]
                      </Link>
                    </Card.Text>
                    <Card.Text>
                      完成觀看影片數量(測驗用)：{usrInfo.TotalFinishTestVideo}部
                      <Link to={'/test'} className='text-decoration-none'>
                        [點擊繼續觀看測驗用影片]
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
      <Container>
        <Row>
          <Col sm={2} xs={4}>
            <Link
              type='button'
              className={styles.videoContainer}
              onClick={() => {
                setShowChoseVideoModal(true);
              }}
            >
              <Row>
                <MdOutlineVideoLibrary className='fs-1' />
                <p className='text-center fs-5'>衛教資訊</p>
              </Row>
            </Link>
          </Col>
          <Col sm={2} xs={4}>
            <Link
              to={'https://www.ylh.gov.tw/?aid=625'}
              className={styles.infoContainer}
            >
              <Row>
                <BsFillBookFill className='fs-1' />
                <p className='text-center fs-5'>衛教天地</p>
              </Row>
            </Link>
          </Col>
          <Col sm={2} xs={4}>
            <Link
              type='button'
              className={styles.recordContainer}
              onClick={() => {
                setShowChoseRecordModal(true);
              }}
            >
              <Row>
                <AiTwotoneReconciliation className='fs-1' />
                <p className='text-center fs-5'>練習紀錄</p>
              </Row>
            </Link>
          </Col>
          <Col sm={2} xs={4}>
            <Link to='/' className={styles.tutorialContainer}>
              <Row>
                <BsTools className='fs-1' />
                <p className='text-center fs-5'>使用教學</p>
              </Row>
            </Link>
          </Col>
          <Col sm={2} xs={4}>
            <Link to='/' className={styles.suggestionContainer}>
              <Row>
                <BsFillQuestionCircleFill className='fs-1' />
                <p className='text-center fs-5'>問題建議</p>
              </Row>
            </Link>
          </Col>
          <Col sm={2} xs={4}>
            <Link to='/' className={styles.settingContainer}>
              <Row>
                <AiFillSetting className='fs-1' />
                <p className='text-center fs-5'>使用者設定</p>
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
                pathname: '/pratice',
              }}
              className={styles.linkContainer_link}
            >
              <h3 className='mt-1 mb-1'>練習用衛教資訊</h3>
            </Link>

            <Link
              to={{
                pathname: '/test',
              }}
              className={styles.linkContainer_link}
            >
              <h3 className='mt-1 mb-1'>測驗用衛教資訊</h3>
            </Link>
          </div>
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
                pathname: '/record/pratice',
              }}
              className={styles.linkContainer_link}
            >
              <h3 className='mt-1 mb-1'>練習用衛教紀錄</h3>
            </Link>

            <Link
              to={{
                pathname: '/record/test',
              }}
              className={styles.linkContainer_link}
            >
              <h3 className='mt-1 mb-1'>測驗用衛教紀錄</h3>
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
