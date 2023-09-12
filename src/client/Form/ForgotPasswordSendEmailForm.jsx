import React from "react";
import { Col, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import BtnBootstrap from "../../components/BtnBootstrap";

const userSendOTPMailSchema = yup.object().shape({
  userSendOTPAccount: yup.string().required("請輸入帳號"),

  userSendOTPMail: yup
    .string()
    .email("請輸入正確的電子郵件格式")
    .required("請輸入信箱"),
});

export default function ForgotPasswordSendEmailForm({
  initialValues,
  onSubmit,
}) {
  return (
    <Col>
      <Formik
        validationSchema={userSendOTPMailSchema}
        onSubmit={onSubmit}
        initialValues={initialValues}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formChangeUserAccount">
              <Form.Label>請輸入帳號：</Form.Label>
              <Form.Control
                type="text"
                name="userSendOTPAccount"
                placeholder="請於此輸入帳號"
                onChange={handleChange}
                value={values.userSendOTPAccount}
                isInvalid={!!errors.userSendOTPAccount}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.userSendOTPAccount}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formChangeUserMail">
              <Form.Label>請輸入電子郵件(email)：</Form.Label>
              <Form.Control
                type="email"
                name="userSendOTPMail"
                placeholder="請於此輸入電子郵件(email)"
                onChange={handleChange}
                value={values.userSendOTPMail}
                isInvalid={!!errors.userSendOTPMail}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.userSendOTPMail}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-grid gap-2">
              <BtnBootstrap
                btnPosition=""
                variant="outline-primary"
                btnSize="md"
                btnType={"submit"}
                text={"下一步"}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Col>
  );
}
