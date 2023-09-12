import React, { useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import OTPInput from "react-otp-input";
import BtnBootstrap from "../../components/BtnBootstrap";
import styles from "../../styles/form/ForgotPasswordSendVerifyCodeForm.module.scss";

export default function ForgotPasswordSendVerifyCodeForm({
  onSubmit,
  email,
  verifyCode,
  setVerifyCode,
  resendOTPMail,
  setForgotPasswordState,
}) {
  const [formCounter, setFormCounter] = React.useState(0);
  // do once when component mounted
  useEffect(() => {
    setFormCounter(60);
  }, []);

  useEffect(() => {
    if (formCounter > 0) {
      setTimeout(() => setFormCounter(formCounter - 1), 1000);
    }
  }, [formCounter]);

  return (
    <Card className={styles.cardContainer}>
      <Card.Title>
        <p className={styles.cardTitle}>請輸入驗證碼</p>
      </Card.Title>
      <Card.Body>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <OTPInput
            value={verifyCode}
            onChange={setVerifyCode}
            numInputs={6}
            separator={<span></span>}
            isInputNum={true}
            renderInput={(props) => <input {...props} />}
            inputStyle={styles.otpInputField}
          />
        </div>
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
              btnSize="md"
              btnType={"button"}
              text={formCounter ? `${formCounter}秒` : "重新發送"}
              onClickEventName={() => {
                resendOTPMail({ mail: email });
                setFormCounter(60);
              }}
              disabled={formCounter !== 0}
            />
          </Col>
          <Col>
            <BtnBootstrap
              btnPosition=""
              variant="outline-danger"
              btnSize="md"
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
