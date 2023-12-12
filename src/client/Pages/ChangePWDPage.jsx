import React, { useState } from "react";
import * as formik from "formik";
import * as yup from "yup";
import { Col, Container, Modal, Form, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import { toast } from "react-toastify";

import FormPwd from "../Form/shared/FormPwd";
import PageTitleHeading from "../../components/PageTitleHeading";
import useBoolean from "../Form/shared/useBoolean";
import useModal from "../../js/useModal";
import BtnBootstrap from "../../components/BtnBootstrap";
import ToastAlert from "../../components/ToastAlert";
import { clearUserSession } from "../../js/userAction";
import { post } from "../axios";

const { Formik } = formik;

export default function ChangePWDPage({ user }) {
  const { client_token } = user;

  const navigate = useNavigate();
  const [showPwd, { setShowPwd }] = useBoolean(false);

  const [pwdScore, setPwdScore] = useState(0);
  const [userNewPwd, setUserNewPwd] = useState({
    clientPWD: "",
    clientLatestPWD: "",
  });

  const [
    PWDConfirmModal,
    handleClosePWDConfirmModal,
    handleShowPWDConfirmModal,
  ] = useModal();

  const userNewPwdSchema = yup.object().shape({
    oldPwd: yup.string().required("請輸入原始密碼"),
    newPwd: yup
      .string()
      .required("請輸入新密碼")
      .test("", "新密碼不得與舊密碼相符", function (value) {
        return this.parent.oldPwd !== value;
      })
      .test("是否為高等強度密碼", "密碼強度不足，請試著加上特殊符號", () => {
        return pwdScore > 2;
      }),
    newPwdCheck: yup
      .string()
      .test("密碼相符", "密碼必須相符", function (value) {
        return this.parent.newPwd === value;
      }),
  });

  const reWriteUserProfile = async ({ api, data, updateType }) => {
    try {
      await post(api, data);
      toast.success("更新個人資料成功，請重新登入", { autoClose: 2000 });
      handleClosePWDConfirmModal();
      setTimeout(() => {
        clearUserSession();
        navigate("/");
      }, 2000);
    } catch (err) {
      console.log(err);
      if (err.response) {
        console.log(err.response);
        const { status, data } = err.response;

        if (status === 404 && data.message === "請求錯誤") {
          handleSessionTimeout();
        } else {
          toast.error(data.message, {
            autoClose: 2000,
          });
        }
        if (updateType === "password") setPassWordConfirmModalShow(false);
      } else {
        // 處理非 API 回應的錯誤
        // ...
      }
    }
  };

  const handleSessionTimeout = () => {
    alert("登入逾時，請重新登入");
    clearUserSession();
    navigate("/");
  };

  return (
    <Container>
      <PageTitleHeading text="修改密碼" styleOptions={3} />
      <Formik
        validationSchema={userNewPwdSchema}
        onSubmit={(values) => {
          handleShowPWDConfirmModal();
          setUserNewPwd({
            clientPWD: values.oldPwd,
            clientLatestPWD: values.newPwd,
          });
        }}
        initialValues={{
          oldPwd: "",
          newPwd: "",
          newPwdCheck: "",
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <FormPwd
              ControlName="oldPwd"
              SetStrengthMeter={false}
              LabelForName="formOldPassword"
              LabelClassName="fs-6"
              LabelMessage="請輸入原始密碼："
              FormControlPlaceHolder="請於這裡輸入原始密碼"
              FeedBackClassName="fs-6"
              PwdValue={values.oldPwd}
              ChangeEvent={handleChange}
              InValidCheck={touched.oldPwd && errors.oldPwd}
              SetShowPwdCondition={setShowPwd}
              ShowPwdCondition={showPwd}
              ErrorMessage={errors.oldPwd}
            />
            <FormPwd
              ControlName="newPwd"
              SetStrengthMeter={true}
              StrengthMeterPwdScore={pwdScore}
              LabelForName="formNewPassword"
              LabelClassName="fs-6"
              FeedBackClassName="fs-6"
              LabelMessage="請輸入新密碼："
              FormControlPlaceHolder="請於這裡輸入新密碼"
              PwdValue={values.newPwd}
              ChangeEvent={handleChange}
              InputEvent={(e) => {
                setPwdScore(zxcvbn(e.target.value).score);
              }}
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
            <Stack gap={2}>
              <Col>
                <Link
                  to="/forgetPassword"
                  className="float-end text-decoration-none"
                >
                  忘記密碼
                </Link>
              </Col>

              <BtnBootstrap
                variant="outline-primary"
                btnSize="md"
                btnType={"submit"}
                text={"送出"}
                disabled={values.oldPwd === user.newPwd}
              />
            </Stack>
          </Form>
        )}
      </Formik>
      <Modal show={PWDConfirmModal} onHide={handleClosePWDConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>變更密碼確認</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fs-5">變更密碼後，會將您登出，請重新登入</p>
          <p className="fs-5">請確認是否要變更密碼</p>
        </Modal.Body>
        <Modal.Footer>
          <BtnBootstrap
            variant="outline-primary"
            btnSize="md"
            btnType={"button"}
            text={"取消"}
            onClickEventName={handleClosePWDConfirmModal}
          ></BtnBootstrap>
          <BtnBootstrap
            variant="outline-danger"
            btnSize="md"
            btnType={"button"}
            text={"確認"}
            onClickEventName={() => {
              reWriteUserProfile({
                api: `client/${client_token}`,
                data: {
                  clientPWD: userNewPwd.clientPWD,
                  clientLatestPWD: userNewPwd.clientLatestPWD,
                },
                updateType: "password",
              });
            }}
          ></BtnBootstrap>
        </Modal.Footer>
      </Modal>
      <ToastAlert />
    </Container>
  );
}
