import React, { useEffect, useState } from "react";
import { Col, Row, Container, Form, Modal } from "react-bootstrap";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import BtnBootstrap from "../../components/BtnBootstrap";
import FormPwd from "../Form/shared/FormPwd";
import useBoolean from "../Form/shared/useBoolean";
import * as formik from "formik";
import * as yup from "yup";
import ConvertNameToHide from "../Form/shared/func/ConvertNameToHide";
import styles from "../../styles/pages/UserSetting.module.scss";
import { post } from "../axios";
import { toast } from "react-toastify";
import ToastAlert from "../../components/ToastAlert";
import { Link, useNavigate } from "react-router-dom";

const { Formik } = formik;

const userNewNameSchema = yup.object().shape({
  userNewName: yup.string().required("請輸入姓名"),
});

const userNewPwdSchema = yup.object().shape({
  oldPwd: yup.string().required("請輸入原始密碼"),
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

const userNewEmailSchema = yup.object().shape({
  userNewEmail: yup
    .string()
    .email("請輸入正確的電子郵件格式")
    .required("請輸入信箱"),
});

export default function UserSetting() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage?.getItem("user") || sessionStorage?.getItem("user")
  );
  const [userNewPwd, setUserNewPwd] = useState({
    clientPWD: "",
    clientLatestPWD: "",
  });

  const [showPwd, { setShowPwd }] = useBoolean(false);

  const [nameModalShow, setNameModalShow] = useState(false);
  const [passwordModalShow, setPasswordModalShow] = useState(false);
  const [passWordConfirmModalShow, setPassWordConfirmModalShow] =
    useState(false);
  const [emailModalShow, setEmailModalShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reWriteUserProfile = async ({ api, data, updateType }) => {
    const operationMap = {
      name: setNameModalShow,
      password: setPasswordModalShow,
      email: setEmailModalShow,
    };
    let rewriteToastid = toast.loading("更新中...");
    try {
      await post(api, data);
      if (updateType === "password") {
        toast.update(rewriteToastid, {
          render: "更新使用者資料成功，請重新登入",
          type: "success",
          autoClose: 2000,
          isLoading: false,
        });
        setPassWordConfirmModalShow(false);
        setTimeout(() => {
          if (sessionStorage.getItem("user")) sessionStorage.clear();
          if (localStorage.getItem("user")) localStorage.clear();
          navigate("/");
        }, 2000);
      } else {
        toast.update(rewriteToastid, {
          render: "更新使用者資料成功",
          type: "success",
          autoClose: 2000,
          isLoading: false,
        });
        const operation = operationMap[updateType];
        if (operation) operation(false);
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 404 && data.message === "請求錯誤") {
          handleSessionTimeout();
        } else {
          toast.update(rewriteToastid, {
            render: data.message,
            type: "error",
            autoClose: 2000,
            isLoading: false,
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
    if (sessionStorage.getItem("user")) sessionStorage.clear();
    if (localStorage.getItem("user")) localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Container>
        <Col>
          <h1 className="text-center">使用者設定</h1>
        </Col>
        <Col className={`mx-auto ${styles.UserSettingContainer}`}>
          <div className="d-flex justify-content-center ms-2 me-2">
            <div
              type={"button"}
              className={styles.ButtonOfEachSettingContainer}
              onMouseDown={() => {
                setNameModalShow(true);
              }}
            >
              <Row className={`${styles.ButtonOfEachSettingContainer_Row}`}>
                <Col className="d-flex align-items-center justify-content-between fs-3">
                  <div className="text-start">
                    使用者名稱
                    <div className={`${styles.UserCurrentName}`}>
                      {ConvertNameToHide(user.client_name)}
                    </div>
                  </div>
                  <MdOutlineKeyboardArrowRight
                    className={`fs-1 ${styles.buttonIco}`}
                  />
                </Col>
              </Row>
            </div>
          </div>
          <div className="d-flex justify-content-center ms-2 me-2">
            <div
              type={"button"}
              className={styles.ButtonOfEachSettingContainer}
              onMouseDown={() => {
                setPasswordModalShow(true);
              }}
            >
              <Row className={`${styles.ButtonOfEachSettingContainer_Row}`}>
                <Col className="d-flex align-items-center justify-content-between fs-3">
                  <div className="text-start">使用者密碼</div>
                  <MdOutlineKeyboardArrowRight
                    className={`fs-1 ${styles.buttonIco}`}
                  />
                </Col>
              </Row>
            </div>
          </div>
          <div className="d-flex justify-content-center ms-2 me-2">
            <div
              type={"button"}
              className={styles.ButtonOfEachSettingContainer}
              onMouseDown={() => {
                setEmailModalShow(true);
              }}
            >
              <Row className={`${styles.ButtonOfEachSettingContainer_Row}`}>
                <Col className="d-flex align-items-center justify-content-between fs-3">
                  <div className="text-start">
                    聯絡信箱
                    <div className={`text-start ${styles.UserCurrentMail}`}>
                      {user.client_email}
                    </div>
                  </div>
                  <MdOutlineKeyboardArrowRight
                    className={`fs-1 ${styles.buttonIco}`}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Container>
      {/* 修改使用者名稱Modal */}
      <Modal show={nameModalShow} onHide={() => setNameModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>使用者名稱</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={userNewNameSchema}
            onSubmit={(values) => {
              const userToUpdate = {
                ...user,
                client_name: values.userNewName,
              };
              const storage = sessionStorage.getItem("user")
                ? sessionStorage
                : localStorage;
              storage.setItem("user", JSON.stringify(userToUpdate));

              reWriteUserProfile({
                api: `client/${user.client_token}`,
                data: {
                  clientName: values.userNewName,
                },
                updateType: "name",
              });
            }}
            initialValues={{
              userNewName: user.client_name,
            }}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formChangeUserName">
                  <Form.Label>請輸入姓名：</Form.Label>
                  <Form.Control
                    type="text"
                    name="userNewName"
                    placeholder="請於此輸入姓名"
                    onChange={handleChange}
                    value={values.userNewName}
                    isInvalid={!!errors.userNewName}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.userNewName}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-grid gap-2">
                  <BtnBootstrap
                    btnPosition=""
                    variant="outline-primary"
                    btnSize="md"
                    btnType={"submit"}
                    text={"送出"}
                    disabled={values.userNewName === user.client_name}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* 修改使用者密碼Modal */}
      <Modal
        show={passwordModalShow}
        onHide={() => setPasswordModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>使用者密碼</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={userNewPwdSchema}
            onSubmit={(values) => {
              setPassWordConfirmModalShow(true);
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
                  <Col>
                    <Link to="/forgetPassword" className="float-end">
                      忘記密碼
                    </Link>
                  </Col>
                  <Col className="d-grid gap-2">
                    <BtnBootstrap
                      btnPosition=""
                      variant="outline-primary"
                      btnSize="md"
                      btnType={"submit"}
                      text={"送出"}
                      disabled={values.userNewEmail === user.client_email}
                    />
                  </Col>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      {/* 修改使用者信箱Modal */}
      <Modal show={emailModalShow} onHide={() => setEmailModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>使用者信箱</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={userNewEmailSchema}
            onSubmit={(values) => {
              const userToUpdate = {
                ...user,
                client_email: values.userNewEmail,
              };
              const storage = sessionStorage.getItem("user")
                ? sessionStorage
                : localStorage;
              storage.setItem("user", JSON.stringify(userToUpdate));
              reWriteUserProfile({
                api: `client/${user.client_token}`,
                data: {
                  clientEmail: values.userNewEmail,
                },
                updateType: "email",
              });
            }}
            initialValues={{
              userNewEmail: user.client_email,
            }}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formChangeUserName">
                  <Form.Label>請輸入電子郵件(email)：</Form.Label>
                  <Form.Control
                    type="email"
                    name="userNewEmail"
                    placeholder="請於此輸入電子郵件(email)"
                    onChange={handleChange}
                    value={values.userNewEmail}
                    isInvalid={!!errors.userNewEmail}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.userNewEmail}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-grid gap-2">
                  <BtnBootstrap
                    btnPosition=""
                    variant="outline-primary"
                    btnSize="md"
                    btnType={"submit"}
                    text={"送出"}
                    disabled={values.userNewEmail === user.client_email}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      {/* 變更密碼警告訊息 */}
      <Modal
        show={passWordConfirmModalShow}
        onHide={() => setPassWordConfirmModalShow(false)}
      >
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
            onClickEventName={() => {
              setPassWordConfirmModalShow(false);
            }}
          ></BtnBootstrap>
          <BtnBootstrap
            variant="outline-danger"
            btnSize="md"
            btnType={"button"}
            text={"確認"}
            onClickEventName={() => {
              reWriteUserProfile({
                api: `client/${user.client_token}`,
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
    </>
  );
}
