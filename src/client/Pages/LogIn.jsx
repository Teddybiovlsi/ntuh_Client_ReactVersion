import React from "react";
import { Container, Form, Col, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../axios";
import BtnBootstrap from "../../components/BtnBootstrap";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LogIn() {
  const [userInfo, setUserInfo] = useState({
    user_account: "",
    user_password: "",
    isRemember: false,
  });

  const [tempuser, setTempUser] = useState(null);
  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      navigate("/Home");
    }
  }, []);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (form.checkValidity() === true) {
      event.preventDefault();
      fetchaLoginData(userInfo);
    }

    setValidated(true);
  };

  const fetchaLoginData = async (data) => {
    const clientSubmit = toast.loading("登入中...");
    try {
      console.log(data);
      const response = await post("client/login", data);

      const userInfo = await response.data;

      //   若中文姓名為三個字，則顯示中間字為＊，例如：王小明 => 王＊明
      //   若中文姓名為四個字以上，則顯示中間兩個字為＊，例如：王小明 => 王＊＊明
      //   若中文姓名為兩個字，則顯示第二個字為＊，例如：王明 => 王＊
      if (userInfo.client_name.length === 2) {
        userInfo.client_name =
          userInfo.client_name[0] + "O" + userInfo.client_name[1];
      } else if (userInfo.client_name.length === 3) {
        userInfo.client_name =
          userInfo.client_name[0] + "O" + userInfo.client_name[2];
      } else {
        userInfo.client_name =
          userInfo.client_name[0] + "OO" + userInfo.client_name[3];
      }

      setTempUser(userInfo);
      console.log(userInfo);

      toast.update(clientSubmit, {
        render: "登入成功，3秒後將回到當前頁面",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate(0);
      }, 3000);
    } catch (error) {
      // console.log(error.response.data);
      console.log(error.code);
      if (error.code === "ECONNABORTED") {
        toast.update(clientSubmit, {
          render: "連線逾時，請稍後再試",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(clientSubmit, {
          render: `${error.response.data.message}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  };

  useEffect(() => {
    if (tempuser !== null) {
      localStorage.setItem("user", JSON.stringify(tempuser));
    }
  }, [tempuser]);

  if (localStorage.getItem("user") == null) {
    return (
      <Container>
        <h1 className="text-center">歡迎光臨台大衛教系統</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Col>
            <Form.Group as={Row} md="4" controlId="validationCustom01">
              <Form.Label>帳號</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="請輸入帳號"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, user_account: e.target.value });
                }}
              />
              <Form.Control.Feedback type="invalid">
                請輸入帳號
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Row} controlId="formPwd">
              <Form.Label>密碼</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="請輸入密碼"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, user_password: e.target.value });
                }}
                isInvalid={ErrorMessage.passwordErrorMessage}
              />
              <Form.Control.Feedback type="invalid">
                請輸入密碼
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              {/* <Link to="/Register">註冊</Link> */}
              <Col>
                <Link to="/ForgetPwd" className="float-end">
                  忘記密碼
                </Link>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Check
                  type="checkbox"
                  label="記住我"
                  className="mt-2"
                  id="remember"
                  value={userInfo.isRemember}
                  onClick={() => {
                    setUserInfo({
                      ...userInfo,
                      isRemember: !userInfo.isRemember,
                    });
                  }}
                />
              </Col>
              <Col>
                <BtnBootstrap
                  btnPosition="mt-2 float-end"
                  btnSize="md"
                  variant="primary"
                  btnType="submit"
                  text="登入"
                />
              </Col>
            </Row>
          </Col>
        </Form>
        <ToastAlert />
      </Container>
    );
  }
}
