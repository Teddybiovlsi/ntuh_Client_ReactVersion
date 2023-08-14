// 建立後台使用者元件
// 包含email認證/密碼驗證/2次密碼驗證
// 送出後台使用者資料到API
// 顯示成功訊息/錯誤訊息
// 若傳送成功，5秒後自動跳轉回到首頁

import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import Card from "react-bootstrap/Card";
import PageTitle from "../../components/Title";
import BtnBootstrap from "../../components/BtnBootstrap";
import useBoolean from "./shared/useBoolean";
import FormEmail from "./shared/FormEmail";
import FormPwd from "./shared/FormPwd";
import AlertBootstrap from "../../components/AlertBootstrap";
import zxcvbn from "zxcvbn";
import { post } from "../axios";
import styles from "../../styles/Form/Registration.module.scss";
import { useNavigate } from "react-router-dom";
import StatusCode from "../../sys/StatusCode";
import FormAccount from "./shared/FormAccount.jsx";

export default function BackendRegistration() {
  const checkPwdHint = "請再次輸入您的密碼";

  const [pwdScore, setPwdScore] = useState(0);
  const [showPwd, { setShowPwd }] = useBoolean(false);

  // 若註冊成功，則顯示成功訊息
  const [successMessage, setSuccessMessage] = useState("");
  // 若註冊失敗，則顯示錯誤訊息
  const [errorMessage, setErrorMessage] = useState("");

  const [successBoolean, setSuccessBoolean] = useState(false);

  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    // redirect to Home page after 5 seconds
    if (shouldRedirect) {
      return navigate("/");
    }
  }, [shouldRedirect]);

  // create a async function to send data to backend
  const sendBackendRegistrationData = async (data, resetForm) => {
    try {
      // 正確格式API
      const response = await post("admin", data);
      // if errorMessage is not empty, then unset it
      {
        errorMessage && setErrorMessage("");
      }
      setSuccessMessage("成功創建");
      setSuccessBoolean(true);
      resetForm();
      // redirect to Home page after 5 seconds
      setTimeout(() => {
        setShouldRedirect(true);
      }, 5000);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        setErrorMessage("連線逾時，請稍後再試");
      } else {
        setErrorMessage(StatusCode(error.response.status));
      }
    }
  };

  const schema = yup.object({
    account: yup.string().required("帳號欄位不得為空"),
    email: yup.string().email("請輸入合法的信箱").required("信箱欄位不得為空"),
    password: yup
      .string()
      .required("密碼欄位不得為空")
      .test("是否為中等強度密碼", "密碼強度不足，請試著多加特殊符號", () => {
        return pwdScore > 0;
      }),
    confirmPassword: yup
      .string()
      .required("再次確認密碼欄位不得為空!")
      .oneOf([yup.ref("password"), null], "前後密碼必須一致"),
  });

  return (
    <>
      <PageTitle title="台大分院雲林分院｜創建後台使用者" />
      {/* 使用自訂Alert元件 */}
      {successMessage || errorMessage ? (
        <AlertBootstrap
          ifsucceed={successBoolean}
          variant={successMessage ? "success" : "danger"}
          children={successMessage ? successMessage : errorMessage}
        />
      ) : (
        ""
      )}
      <div className="FormStyle d-flex align-items-center justify-content-center">
        <Card className={`${styles.RegisterCard}`}>
          <Card.Title className={`${styles.FormTitle}`}>
            <h1 className="fs-2">
              <strong>創建後台使用者</strong>
            </h1>
          </Card.Title>
          <Card.Body>
            <Formik
              validationSchema={schema}
              onSubmit={(data, { resetForm }) => {
                //call sendBackendRegistrationData function and check if it is successful
                sendBackendRegistrationData(data, resetForm);
              }}
              initialValues={{
                email: "",
                password: "",
                confirmPassword: "",
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <FormEmail
                    ChangeEvent={handleChange}
                    BlurEvent={handleBlur}
                    EmailValue={values.email}
                    ValidCheck={touched.email && !errors.email}
                    InValidCheck={touched.email && errors.email}
                    ErrorMessage={errors.email}
                  />
                  <FormAccount
                    ChangeEvent={handleChange}
                    BlurEvent={handleBlur}
                    AccountValue={values.account}
                    ValidCheck={touched.account && !errors.account}
                    InValidCheck={touched.account && errors.account}
                    ErrorMessage={errors.account}
                  />
                  <FormPwd
                    GroupClassName="mb-1"
                    SetStrengthMeter={true}
                    StrengthMeterPwdScore={pwdScore}
                    ChangeEvent={handleChange}
                    BlurEvent={handleBlur}
                    InputEvent={(e) => {
                      setPwdScore(zxcvbn(e.target.value).score);
                    }}
                    PwdValue={values.password}
                    ValidCheck={touched.password && !errors.password}
                    InValidCheck={touched.password && errors.password}
                    IconID={"showPass"}
                    SetShowPwdCondition={setShowPwd}
                    ShowPwdCondition={showPwd}
                    ErrorMessage={errors.password}
                  />
                  <FormPwd
                    LabelForName="checkInputPassword"
                    ControlName="confirmPassword"
                    LabelMessage="請再次確認輸入密碼"
                    FormControlPlaceHolder={checkPwdHint}
                    BlurEvent={handleBlur}
                    ChangeEvent={handleChange}
                    PwdValue={values.confirmPassword}
                    SetShowPwdCondition={setShowPwd}
                    ShowPwdCondition={showPwd}
                    ValidCheck={
                      touched.confirmPassword && !errors.confirmPassword
                    }
                    InValidCheck={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    CorrectMessage="確認密碼與輸入密碼相符"
                    ErrorMessage={errors.confirmPassword}
                  />
                  <div className={`${styles.btnPosition} d-grid gap-2 p-2`}>
                    <BtnBootstrap
                      text={"送出"}
                      btnType={"submit"}
                      variant={"primary"}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
