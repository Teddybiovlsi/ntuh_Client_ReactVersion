import React, { useState } from "react";
import {
  Accordion,
  Col,
  Container,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import PageTitleHeading from "../../components/PageTitleHeading";

export default function UsingTip() {
  const [tutorial, setTutorial] = useState("衛教資訊");

  const healthEducationInfo = () => {
    return (
      <Row>
        <Row>
          <h3>衛教資訊</h3>
        </Row>
        <Row>
          <p>衛教資訊為影片與問題的組合共分成兩種類型：</p>
          <ListGroup as="ol" numbered>
            <ListGroup.Item as="li">練習用</ListGroup.Item>
            <ListGroup.Item as="li">測驗用</ListGroup.Item>
          </ListGroup>
          <p className="mt-1 mb-0 text-center">
            &ndash;需注意到！練習用影片會與測驗用影片不相同&ndash;
          </p>
          <p className="text-danger text-center">
            練習、測驗用的觀看進度、練習章節會隨著影片的問題多寡而不同
          </p>
          <p>
            以下有衛教資訊的詳細介紹，可依照需求點選對應的衛教資訊使用教學進行觀看
          </p>

          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>如何得知影片的練習章節進度?</Accordion.Header>
              <Accordion.Body>
                <p>
                  可點選自己想要知道的
                  <b className="text-primary">練習/測驗用衛教資訊</b>並
                  <b className="text-danger">點選下圖資訊紅框處</b>
                  即可得知當前衛教資訊所有的練習進度/
                  <br />
                  <b className="text-primary">下圖藍框處為單一章節練習進度</b>
                </p>
                <Image src="src/assets/衛教資訊練習進度查詢.jpg" fluid />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>如何觀看影片?</Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                如何知道自己的章節練習是否回答正確or完成?
              </Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Row>
      </Row>
    );
  };

  const personalRecord = () => {
    return (
      <Row>
        <Row>
          <h3>個人紀錄</h3>
        </Row>
        <Row>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt
            tempore quos, vero facere est corporis dolor neque earum hic fugiat
            ipsam, veritatis, asperiores libero modi. Tempora veritatis hic
            officia provident!
          </p>
        </Row>
      </Row>
    );
  };

  const personalSetting = () => {
    return (
      <Row>
        <Row>
          <h3>個人設定</h3>
        </Row>
        <Row>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt
            tempore quos, vero facere est corporis dolor neque earum hic fugiat
            ipsam, veritatis, asperiores libero modi. Tempora veritatis hic
            officia provident!
          </p>
        </Row>
      </Row>
    );
  };

  const tutorialSwitch = (tutorial) => {
    switch (tutorial) {
      case "衛教資訊":
        return healthEducationInfo();
      case "個人紀錄":
        return personalRecord();
      case "個人設定":
        return personalSetting();
      default:
        return healthEducationInfo();
    }
  };

  return (
    <Container>
      <Row>
        <PageTitleHeading text="使用說明" styleOptions={4} />
      </Row>
      <Row>
        <Col md={3} className="mt-5">
          <ListGroup>
            <ListGroup.Item
              action
              onClick={() => {
                setTutorial("衛教資訊");
              }}
              className="text-primary"
            >
              衛教資訊
            </ListGroup.Item>
            <ListGroup.Item
              action
              className="text-secondary"
              onClick={() => {
                setTutorial("個人紀錄");
              }}
            >
              個人紀錄
            </ListGroup.Item>

            <ListGroup.Item
              action
              className="text-danger"
              onClick={() => {
                setTutorial("個人設定");
              }}
            >
              使用者設定
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col>{tutorialSwitch(tutorial)}</Col>
      </Row>
    </Container>
  );
}
