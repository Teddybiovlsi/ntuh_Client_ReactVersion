import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import PageTitleHeading from "../../components/PageTitleHeading";
import Logo from "../../assets/corporate.png";
import Logo2x from "../../assets/corporate2x.png";
import LogoSvg from "../../assets/logo.svg";

const AboutUs = () => {
  return (
    <Container>
      <Row className="my-4">
        <Col>
          <PageTitleHeading text="關於我們" styleOptions={9} />
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Image src={Logo} fluid />
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            本系統由
            <b className="text-primary">國立臺灣大學醫學院附設醫院雲林分院</b>與
            <b className="text-secondary">
              國立雲林科技大學跨領域系統暨生醫應用設計實驗室
            </b>
            共同開發合作，目的在於提供一個一個完整衛教系統，讓醫療人員能夠透過本系統篩選出適合的衛教影片，並且透過本系統提供的功能，讓醫療人員能夠更有效率的進行衛教。
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>開發團隊</h2>
          <p>
            我們是來自國立雲林科技大學跨領域系統暨生醫應用設計實驗室的團隊，由
            <br />
            智慧數據所&nbsp;薛雅馨&nbsp;所長
            <br />
            智慧數據所&nbsp;柯明達&nbsp;助理教授
          </p>
          <h2>合作開發</h2>
          <p>
            國立臺灣大學醫學院附設醫院雲林分院
            <br />
            護理部&nbsp;林芳如&nbsp;督導長
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2>與我們聯絡</h2>
          <p>
            若您有任何使用上的問題，歡迎透過
            <a href="mailto:biovlsidrh@gmail.com">電子郵件</a>
            與我們聯絡，我們將盡快回覆您的問題...
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
