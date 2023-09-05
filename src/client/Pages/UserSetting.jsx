import React from "react";
import {
  Col,
  Row,
  Container,
  Form,
  Modal,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import styles from "../../styles/pages/UserSetting.module.scss";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import BtnBootstrap from "../../components/BtnBootstrap";
import FormPwd from "../Form/shared/FormPwd";
import useBoolean from "../Form/shared/useBoolean";
import * as formik from "formik";
import * as yup from "yup";

export default function UserSetting() {
  const user = JSON.parse(
    localStorage?.getItem("user") || sessionStorage?.getItem("user")
  );
  const { Formik } = formik;

  const schema = yup.object().shape({
    oldPwd: yup.string().required(),
    newPwd: yup.string().required(),
    newPwdCheck: yup
      .string()
      .test("密碼相符", "密碼必須相符", function (value) {
        return this.parent.newPwd === value;
      }),
  });

  const [showPwd, { setShowPwd }] = useBoolean(false);

  const [nameModalShow, setNameModalShow] = React.useState(false);
  const [passwordModalShow, setPasswordModalShow] = React.useState(false);
  const [emailModalShow, setEmailModalShow] = React.useState(false);

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
                <Col className="text-start fs-3">
                  <Col>使用者名稱</Col>
                  <Col className={styles.UserCurrentName}>
                    {user.client_name}
                  </Col>
                </Col>
                <Col className="text-end">
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
                <Col className="text-start fs-3">使用者密碼</Col>
                <Col className="text-end">
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
                <Col className="text-start fs-3">
                  <Col>聯絡信箱</Col>
                  <Col className={styles.UserCurrentMail}>
                    {user.client_email}
                  </Col>
                </Col>
                <Col className="text-end">
                  <div className="vertical-align-middle">
                    <MdOutlineKeyboardArrowRight
                      className={`fs-1 ${styles.buttonIco}`}
                    />
                  </div>
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
        <Modal.Body>更改使用者名稱位置</Modal.Body>
        <Modal.Footer>送出 重置</Modal.Footer>
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
            validationSchema={schema}
            onSubmit={(values) => {
              console.log(values);
            }}
            initialValues={{
              oldPwd: "",
              newPwd: "",
              newPwdCheck: "",
            }}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              touched,
              errors,
              resetForm,
            }) => (
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
                <BtnBootstrap
                  btnPosition=""
                  variant="outline-primary"
                  btnSize="md"
                  btnType={"button"}
                  text={"重置"}
                  onClickEventName={() => resetForm()}
                ></BtnBootstrap>
                <BtnBootstrap
                  variant="outline-danger"
                  btnSize="md"
                  btnType={"submit"}
                  text={"送出"}
                ></BtnBootstrap>
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
        <Modal.Body>更改使用者信箱位置</Modal.Body>
        <Modal.Footer>重置 送出</Modal.Footer>
      </Modal>
    </>
  );
}
