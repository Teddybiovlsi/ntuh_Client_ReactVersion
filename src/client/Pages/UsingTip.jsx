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
import HealthEducationInfo_Image_Chapter from "../../assets/衛教資訊練習進度查詢.jpg";
import HealthEducationInfo_Image_WatchVideoStep1 from "../../assets/如何觀看影片Step1.jpg";
import HealthEducationInfo_Image_WatchVideoStep2 from "../../assets/如何觀看影片Step2.jpg";
import HealthEducationInfo_Image_ChapterCorrect from "../../assets/章節正確訊息.jpg";
import HealthEducationInfo_Image_ChapterInCorrect from "../../assets/章節錯誤訊息.jpg";
import HealthEducationInfo_Image_ChapterUploadFailed from "../../assets/章節上傳失敗訊息.jpg";
import PersonalRecord_Image_RangeFilter from "../../assets/區段篩選器.jpg";
import PersonalRecord_Image_RangeFilterNoData from "../../assets/該區段無資料.jpg";

export default function UsingTip() {
  const [tutorial, setTutorial] = useState("衛教資訊");

  // 衛教資訊使用說明
  const healthEducationInfo = () => {
    return (
      <Container>
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

          <Accordion defaultActiveKey="練習章節進度">
            <Accordion.Item eventKey="練習章節進度">
              <Accordion.Header>如何得知影片的練習章節進度?</Accordion.Header>
              <Accordion.Body>
                <Container>
                  <Row>
                    <p>
                      可點選自己想要知道的
                      <b className="text-primary">練習/測驗用衛教資訊</b>並
                      <b className="text-danger">點選下圖資訊紅框處</b>
                      即可得知當前衛教資訊所有的練習進度/測驗進度
                      <br />
                      <b className="text-primary">
                        下圖藍框處為單一章節內測驗進度
                      </b>
                    </p>
                  </Row>
                  <Row>
                    <Image src={HealthEducationInfo_Image_Chapter} fluid />
                  </Row>
                </Container>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="如何觀看影片">
              <Accordion.Header>如何觀看影片?</Accordion.Header>
              <Accordion.Body>
                <Container>
                  <Row>
                    <p className="fs-3 text-center text-danger">
                      &#9734;手機版用戶建議以全螢幕下觀看可有較好的觀看體驗&#9734;
                    </p>
                    <p>
                      可直接點選如<b className="text-primary">左下圖藍框處</b>
                      選擇自己想要觀看的章節進行點選觀看
                    </p>
                    <p className="fs-3">PC端/Android用戶：</p>
                    <p>
                      點選後會出現如<b className="text-danger">右下圖</b>
                      所示之視窗點選&#9654;後即可觀看影片，
                      <b className="text-danger">
                        若需要全螢幕觀看可點選右下角全螢幕按鈕
                      </b>
                    </p>

                    <p className="fs-3">iOS用戶：</p>
                    <p>
                      點選後會出現如<b className="text-danger">右下圖</b>
                      所示之視窗，不過iOS用戶因撥放器需讀取相關暫存檔案，因此出現轉圈圈的情況屬正常現象，請耐心等待轉圈結束後即可觀看影片，
                      <b className="text-danger">
                        若需要全螢幕觀看可點選右下角全螢幕按鈕
                      </b>
                    </p>
                  </Row>
                  <Row>
                    <Col md={6} xs={6}>
                      <Image
                        src={HealthEducationInfo_Image_WatchVideoStep1}
                        fluid
                      />
                    </Col>
                    <Col md={6} xs={6}>
                      <Image
                        src={HealthEducationInfo_Image_WatchVideoStep2}
                        fluid
                      />
                    </Col>
                  </Row>
                </Container>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="如何得知練習情形">
              <Accordion.Header>如何得知自己的章節練習情形?</Accordion.Header>
              <Accordion.Body>
                <Container>
                  <Row>
                    <p>
                      在影片出現對影選項選擇後會出現以下
                      <b className="text-primary">三種圖示</b>之情形：
                    </p>
                  </Row>
                  <Row>
                    <Col md={4} xs={4}>
                      <Image
                        src={HealthEducationInfo_Image_ChapterCorrect}
                        fluid
                      />
                      <p className="text-center text-success">
                        第一種為回答正確
                      </p>
                    </Col>
                    <Col md={4} xs={4}>
                      <Image
                        src={HealthEducationInfo_Image_ChapterInCorrect}
                        fluid
                      />
                      <p className="text-center text-danger">
                        第二種為回答錯誤
                      </p>
                    </Col>
                    <Col md={4} xs={4}>
                      <Image
                        src={HealthEducationInfo_Image_ChapterUploadFailed}
                        fluid
                      />
                      <p className="text-center text-danger">
                        第三種為伺服器發生錯誤
                        <br />
                        請過一段時間後再試
                      </p>
                    </Col>
                  </Row>
                </Container>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Row>
      </Container>
    );
  };
  // 個人紀錄使用說明
  const personalRecord = () => {
    return (
      <Container>
        <Row>
          <h3>個人紀錄</h3>
        </Row>
        <Row>
          <p>個人紀錄共分成兩種類型，可依照自行需求查看對應類別</p>
          <ListGroup as="ol" numbered>
            <ListGroup.Item as="li">練習用</ListGroup.Item>
            <ListGroup.Item as="li">測驗用</ListGroup.Item>
          </ListGroup>

          <Accordion defaultActiveKey="區段該如何進行篩選" className="mt-2">
            <Accordion.Item eventKey="區段該如何進行篩選">
              <Accordion.Header>區段篩選要如何進行使用?</Accordion.Header>
              <Accordion.Body>
                <Container>
                  <Row>
                    <p className="text-primary fs-4 m-0">影片篩選</p>
                    <p className="ms-3">
                      可點選<b className="text-danger">選擇影片</b>
                      選項進行對應影片的篩選 <br />
                    </p>
                    <p className="text-danger text-center">
                      &#9733;需注意！每一個人的選擇影片的篩選器皆為客製化內容
                      所以選擇器內容會有所變動 &#9733;
                    </p>
                    <p className="text-primary fs-4 m-0">完成進度篩選</p>
                    <p className="ms-3">
                      可點選<b className="text-danger">完成進度</b>
                      選項進行對應完成進度的篩選，選項共分為以下兩種：
                      <ol>
                        <li>已完成</li>
                        <li>未完成</li>
                      </ol>
                    </p>
                    <p className="text-primary fs-4 m-0">日期篩選</p>
                    <p className="ms-3">
                      可點選
                      <b className="text-danger">
                        起始/結束日期進行對應日期的選擇
                      </b>
                      ，選擇後即可進行對應日期的篩選
                    </p>
                    <p className="text-danger text-center">
                      &#9733;需注意！起始日期不得大於結束日期 &#9733;
                    </p>
                  </Row>
                  <Row>
                    <Image src={PersonalRecord_Image_RangeFilter} fluid />
                  </Row>
                </Container>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="該區段無資料">
              <Accordion.Header>若該區段無任何資料?</Accordion.Header>
              <Accordion.Body>
                <Container>
                  <Row>
                    <p>若該區段無任何資料則會顯示如下圖之訊息</p>
                  </Row>
                  <Row>
                    <Image src={PersonalRecord_Image_RangeFilterNoData} fluid />
                  </Row>
                </Container>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Row>
      </Container>
    );
  };

  const personalSetting = () => {
    return (
      <Container>
        <Row>
          <h3>個人設定</h3>
        </Row>
        <Row></Row>
      </Container>
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
