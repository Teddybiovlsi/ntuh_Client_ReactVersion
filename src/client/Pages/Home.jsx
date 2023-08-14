import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MdOutlineVideoLibrary } from "react-icons/md";
import {
  BsFillBookFill,
  BsTools,
  BsFillQuestionCircleFill,
} from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";
import styles from "../../styles/pages/HomePage.module.scss";
import { useState } from "react";
import { useEffect } from "react";

export default function Home() {
  const [usrName, setUsrName] = useState(
    JSON.parse(localStorage?.getItem("user")).client_name
  );
  //   console.log("usrName", usrName);
  //   若中文姓名為三個字，則顯示中間字為＊，例如：王小明 => 王＊明
  //   若中文姓名為四個字以上，則顯示中間兩個字為＊，例如：王小明 => 王＊＊明
  //   若中文姓名為兩個字，則顯示第二個字為＊，例如：王明 => 王＊
  useEffect(() => {
    if (usrName.length === 2) {
      setUsrName(usrName[0] + "O");
    } else if (usrName.length === 3) {
      setUsrName(usrName[0] + "O" + usrName[2]);
    } else {
      setUsrName(usrName[0] + "OO" + usrName[3]);
    }
  }, [usrName]);

  return (
    <>
      <Col>
        <Row>
          <Card>
            <Card.Title>{usrName} 您好</Card.Title>
            <Card.Body>
              <Card.Text>影片總觀看時間：OO小時OO分鐘</Card.Text>
              <Card.Text>
                完成觀看影片數量(練習用)：OOO[點擊繼續觀看練習用影片]
              </Card.Text>
              <Card.Text>
                完成觀看影片數量(測驗用)：OOO[點擊繼續觀看測驗用影片]
              </Card.Text>
            </Card.Body>
          </Card>
        </Row>
      </Col>
      <Container>
        <Row>
          <Col sm={2} xs={4}>
            <Link to="/" className={styles.videoContainer}>
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
          <Col sm={2} xs={6}>
            <Link to="/" className={styles.settingContainer}>
              <Row>
                <AiFillSetting className="fs-1" />
                <p className="text-center fs-5">使用者設定</p>
              </Row>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}
