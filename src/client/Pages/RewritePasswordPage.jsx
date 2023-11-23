import React from "react";
import * as formik from "formik";
import * as yup from "yup";
import { Col, Container, Form, Row } from "react-bootstrap";
import PageTitleHeading from "../../components/PageTitleHeading";
import FormPwd from "../Form/shared/FormPwd";
import BtnBootstrap from "../../components/BtnBootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import useBoolean from "../Form/shared/useBoolean";
import ToastAlert from "../../components/ToastAlert";
import { post } from "../axios";
import { toast } from "react-toastify";

const { Formik } = formik;
const userNewPwdSchema = yup.object().shape({
  newPwd: yup
    .string()
    .required("請輸入新密碼")
    .test("", "新密碼不得與舊密碼相符", function (value) {
      return this.parent.oldPwd !== value;
    }),
  newPwdCheck: yup.string().test("密碼相符", "密碼必須相符", function (value) {
    return this.parent.newPwd === value;
  }),
});

export default function RewritePasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showPwd, { setShowPwd }] = useBoolean(false);

  const handleSessionTimeout = () => {
    // alert("登入逾時，請重新登入");
    // if (sessionStorage.getItem("user")) sessionStorage.clear();
    // if (localStorage.getItem("user")) localStorage.clear();
    // navigate("/");
  };

  const rewritePasswordSubmit = async (userToRewrite) => {
    let clientSubmit = toast.loading("上傳資料中...");
    try {
      console.log(userToRewrite);
      const res = await post(`visitor/renewPassword`, userToRewrite);
      toast.update(clientSubmit, {
        render: "密碼重設成功，3秒後將回到登入頁面",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setTimeout(() => {
        if (sessionStorage.getItem("user")) sessionStorage.clear();
        if (localStorage.getItem("user")) localStorage.clear();
        navigate("/");
      }, 2000);
    } catch (error) {
      const { status, data } = error.response;
      console.log(data.error);
      if (status === 404 && data.message === "請求錯誤") {
        handleSessionTimeout();
      } else {
        toast.update(clientSubmit, {
          render: data.message,
          type: "error",
          autoClose: 2000,
          isLoading: false,
        });
      }
      setTimeout(() => {
        navigate("/forgetPassword", { replace: true });
      }, 1000);
    }
  };

  return (
    <>
      <Container>
        <Row>
          <PageTitleHeading text="重設密碼" styleOptions={6} />
        </Row>
        <Row>
          <Col>
            <Formik
              initialValues={{
                newPwd: "",
                newPwdCheck: "",
              }}
              validationSchema={userNewPwdSchema}
              onSubmit={(values) => {
                const userToUpdate = {
                  userIdentity: location.state?.user?.userSendOTPAccount,
                  usrCode: location.state?.verifyCode,
                  clientPassword: values.newPwd,
                };

                rewritePasswordSubmit(userToUpdate);
              }}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <FormPwd
                    ControlName="newPwd"
                    SetStrengthMeter={false}
                    LabelForName="formNewPassword"
                    LabelClassName="fs-6"
                    FeedBackClassName="fs-6"
                    LabelMessage="請輸入新密碼："
                    FormControlPlaceHolder="請於這裡輸入新密碼"
                    PwdValue={values.newPwd}
                    ChangeEvent={handleChange}
                    InValidCheck={touched.newPwd && errors.newPwd}
                    SetShowPwdCondition={setShowPwd}
                    ShowPwdCondition={showPwd}
                    ErrorMessage={errors.newPwd}
                  />
                  <FormPwd
                    ControlName="newPwdCheck"
                    SetStrengthMeter={false}
                    LabelForName="formNewPasswordCheck"
                    LabelClassName="fs-6"
                    FeedBackClassName="fs-6"
                    LabelMessage="請再次輸入新密碼："
                    FormControlPlaceHolder="請於這裡再次輸入新密碼"
                    PwdValue={values.newPwdCheck}
                    ChangeEvent={handleChange}
                    InValidCheck={touched.newPwdCheck && errors.newPwdCheck}
                    SetShowPwdCondition={setShowPwd}
                    ShowPwdCondition={showPwd}
                    ErrorMessage={errors.newPwdCheck}
                  />
                  <div className="float-end"></div>
                  <div className="d-grid gap-2">
                    <Col className="d-grid gap-2">
                      <BtnBootstrap
                        btnPosition=""
                        variant="outline-primary"
                        btnSize="md"
                        btnType={"submit"}
                        text={"送出"}
                      />
                    </Col>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
      <ToastAlert />
    </>
  );
}
