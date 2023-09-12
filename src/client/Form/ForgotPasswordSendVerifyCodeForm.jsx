import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import OTPInput from "react-otp-input";
import BtnBootstrap from "../../components/BtnBootstrap";
import styles from "../../styles/pages/ForgotPasswordForm.module.scss";

export default function ForgotPasswordSendVerifyCodeForm({
  onSubmit,
  email,
  verifyCode,
  setVerifyCode,
  counter,
  postOTPMail,
}) {
  return (
    <Card className={styles.cardContainer}>
      <Card.Title>
        <p className={styles.cardTitle}>請輸入驗證碼</p>
      </Card.Title>
      <Card.Body>
        <OTPInput
          value={verifyCode}
          onChange={setVerifyCode}
          numInputs={6}
          separator={<span></span>}
          isInputNum={true}
          shouldAutoFocus={true}
          renderInput={(props) => <input {...props} />}
          inputStyle={styles.otpInputField}
        />
        <Row className="mt-2">
          <p className={styles.alertMessage}>
            認證碼已發送至<b>{email}</b>中
          </p>
        </Row>
        <Row className="mt-2">
          <Col>
            <BtnBootstrap
              btnPosition="float-end"
              variant="outline-primary"
              btnSize="sm"
              btnType={"button"}
              text={counter ? counter : "重新發送"}
              onClickEventName={() => {
                postOTPMail({ mail: email });
                setCounter(60);
              }}
              disabled={counter !== 0}
            />
          </Col>
          <Col>
            <BtnBootstrap
              btnPosition=""
              variant="outline-danger"
              btnSize="sm"
              btnType={"button"}
              text={"送出"}
              onClickEventName={onSubmit}
              disabled={verifyCode.length !== 6}
            />
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <div className="d-grid gap-2">
          <BtnBootstrap
            btnPosition=""
            variant="outline-primary"
            btnSize="sm"
            btnType={"button"}
            text={"返回"}
            onClickEventName={() => {
              setForgotPasswordState(0);
            }}
          />
        </div>
      </Card.Footer>
    </Card>
  );
}