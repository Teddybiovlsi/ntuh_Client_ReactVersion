import React, { useEffect, useState } from "react";
import { Col, Container } from "react-bootstrap";
import { post } from "../axios";
import ForgotPasswordSendEmailForm from "../Form/ForgotPasswordSendEmailForm";
import ForgotPasswordSendVerifyCodeForm from "../Form/ForgotPasswordSendVerifyCodeForm";
import PageTitleHeading from "../../components/PageTitleHeading";
import { useNavigate } from "react-router-dom";

const SUCCESS_MESSAGES = {
  SEND_OTP_MAIL: "信件發送成功",
  VERIFY_CODE: "驗證成功",
  GENERAL: "請求成功",
};
// 提取常數
const ERROR_MESSAGES = {
  FREQUENT_REQUEST: "請求過於頻繁，請1分鐘後再試",
  GENERAL_ERROR: "請求發生錯誤，請稍後再試",
};

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const user = JSON.parse(
    localStorage?.getItem("user") || sessionStorage?.getItem("user")
  );

  const [usrInfo, setUsrInfo] = useState({
    userSendOTPAccount: "",
    userSendOTPMail: "",
  });
  const [verifyCode, setVerifyCode] = useState("");
  // 設定忘記密碼頁面狀態
  const [forgotPasswordState, setForgotPasswordState] = useState(0);
  // 此為倒數計時器，用於驗證碼發送後的倒數計時防止重複發送
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    }
  }, [counter]);

  // useEffect(() => {
  //   if (forgotPasswordState === 1) {
  //     setCounter(0);
  //   }
  // }, [forgotPasswordState]);

  //   設定初始信箱值
  const [initUserValues, setInitUserValues] = useState({
    userSendOTPAccount: usrInfo?.userSendOTPAccount || "",
    userSendOTPMail: user.client_email,
  });
  // 向後端請求發送驗證發送信件
  const postOTPMail = async (userToRewrite) => {
    try {
      const response = await post(`visitor/findAccount`, userToRewrite);
    } catch (error) {
      const errorMessage = error.response.data.error;
      let alertMessage = ERROR_MESSAGES.GENERAL_ERROR;
      console.log(error);

      switch (errorMessage) {
        case "信件發送失敗":
        case "請求過於頻繁，請1分鐘後再試":
          alertMessage = errorMessage;
          break;
        default:
          break;
      }
      alert(alertMessage);
    }
  };

  const postVerifyCode = async (userToRewrite) => {
    try {
      const response = await post(`visitor/rewritePassword`, userToRewrite);

      navigate("/rewritePasswordPage", {
        replace: true,
        state: { verifyCode: verifyCode, user: initUserValues },
      });
    } catch (error) {
      const errorMessage = error.response.data.error;
      let alertMessage = ERROR_MESSAGES.GENERAL_ERROR;

      console.log(error);
      switch (errorMessage) {
        case "驗證碼錯誤":
        case "驗證碼錯誤次數過多，請重新發送驗證碼":
        case "驗證碼已過期，請重新發送驗證碼":
        case "驗證碼請求逾時，請重新發送驗證碼":
          alertMessage = errorMessage;
          break;
        default:
          break;
      }

      alert(alertMessage);
    }
  };

  const handleEmailSubmit = (values) => {
    const userToRewrite = {
      userIdentity: values.userSendOTPAccount,
      mail: values.userSendOTPMail,
    };
    // setInitUserValues to update email and account
    setInitUserValues(values);

    postOTPMail(userToRewrite);
    setForgotPasswordState(1);
  };

  const handleVerifyCodeSubmit = () => {
    const userToRewrite = {
      userIdentity: initUserValues.userSendOTPAccount,
      clientVerificationCode: verifyCode,
    };
    postVerifyCode(userToRewrite);
  };

  const stateChangePage = () => {
    switch (forgotPasswordState) {
      case 0:
        return (
          <ForgotPasswordSendEmailForm
            initialValues={initUserValues}
            onSubmit={handleEmailSubmit}
          />
        );
      case 1:
        return (
          <ForgotPasswordSendVerifyCodeForm
            email={initUserValues.userSendOTPMail}
            verifyCode={verifyCode}
            setVerifyCode={setVerifyCode}
            resendOTPMail={postOTPMail}
            onSubmit={handleVerifyCodeSubmit}
            setForgotPasswordState={setForgotPasswordState}
          />
        );
      default:
        break;
    }
  };

  return (
    <Container>
      <Col>
        <PageTitleHeading text="忘記密碼" styleOptions={6} />
      </Col>
      {stateChangePage()}
    </Container>
  );
}
