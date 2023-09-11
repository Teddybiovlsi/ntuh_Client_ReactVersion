import React, { useState } from "react";
import { Row, Col, Container, Form } from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import BtnBootstrap from "../../components/BtnBootstrap";

export default function ForgotPasswordPage() {
  const user = JSON.parse(
    localStorage?.getItem("user") || sessionStorage?.getItem("user")
  );

  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [password, setPassword] = useState("");

  const { Formik } = formik;

  const userNewEmailSchema = yup.object().shape({
    userNewEmail: yup
      .string()
      .email("請輸入正確的電子郵件格式")
      .required("請輸入信箱"),
  });

  return (
    <Container>
      <Col>
        <h1 className="text-center">忘記密碼</h1>
      </Col>
      <Col>
        <Col>
          <Formik
            validationSchema={userNewEmailSchema}
            onSubmit={(values) => {
              const userToRewrite = {
                mail: values.userNewEmail,
              };
              console.log(userToRewrite);
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
                    text={"下一步"}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </Col>
      </Col>
    </Container>
  );
}
