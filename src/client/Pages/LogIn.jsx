import React, { useState, useEffect } from "react";
import { Container, Form, Col, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegQuestionCircle } from "react-icons/fa";
import { MdEmojiPeople } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";

import BtnBootstrap from "../../components/BtnBootstrap";
import ToastAlert from "../../components/ToastAlert";
import { get, post } from "../axios";
import { getUserSession, setUserSession } from "../../js/userAction";

export default function LogIn() {
  let navigate = useNavigate();

  const [checkuserInfo, setCheckuserInfo] = useState(
    !localStorage.getItem("user") && !sessionStorage.getItem("user")
  );

  const [userInfo, setUserInfo] = useState({
    user_account: "",
    user_password: "",
    isRemember: false,
  });

  const [tempuser, setTempUser] = useState(null);
  const [validated, setValidated] = useState(false);

  const user = getUserSession();

  useEffect(() => {
    if (!checkuserInfo) {
      if (user.permission === "ylhClient") {
        navigate("/Home");
      }
    }
  }, [checkuserInfo]);

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
  /**
   * 透過 `axios` 套件，向後端發送登入請求。
   *
   * @param {Object} data - 使用者輸入的帳號密碼資料。
   * @param {string} data.user_account - 使用者輸入的帳號。
   * @param {string} data.user_password - 使用者輸入的密碼。
   * @param {boolean} data.isRemember - 使用者是否勾選「記住我」。
   *
   * @returns {Object} userInfo - 後端回傳的使用者資料。
   */
  const fetchaLoginData = async (data) => {
    let clientSubmit = toast.loading("登入中...");
    try {
      // console.log(data);
      const response = await post("client/login", data);

      const userInfo = response.data;
      console.log(userInfo);
      setTempUser(userInfo);
      // console.log(userInfo);

      toast.update(clientSubmit, {
        render: "登入成功，3秒後將回到當前頁面",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/Home");
      }, 3000);
    } catch (error) {
      // console.log(error.response.data);
      // console.log(error.code);
      if (error.code === "ECONNABORTED") {
        toast.update(clientSubmit, {
          render: "連線逾時，請稍後再試",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        console.log(error.response.data);
        toast.update(clientSubmit, {
          render: `${error.response.data.message}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  };

  /**
   * 透過 `axios` 套件，向後端發送訪客登入請求。
   *
   * @returns {Object} guestInfo - 後端回傳的訪客資料。
   * @returns {string} guestInfo.permission - 訪客的權限。
   * @returns {string} guestInfo.guestInfo - 訪客的臨時權杖。
   * @returns {string} guestInfo.expires_in - 訪客臨時權杖的逾期時間。
   */
  const fetchGuestLoginData = async () => {
    try {
      const response = await get("guest/temporaryToken");
      const guestInfo = response.data;

      setUserSession(guestInfo, false);
      navigate("/Home");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (tempuser !== null) {
      setUserSession(tempuser, userInfo.isRemember);
      setCheckuserInfo(tempuser);
    }
  }, [tempuser]);

  if (!localStorage.getItem("user") || !sessionStorage.getItem("user")) {
    return (
      <Container>
        <h1 className="text-center">歡迎光臨衛教系統</h1>
        <p className="text-primary text-center fs-3">請登入</p>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col xs={12} className="mb-2">
              <Form.Group md="4" controlId="validationCustom01">
                <Form.Label style={{ cursor: "pointer" }}>帳號</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="請輸入帳號"
                  maxLength={7}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, user_account: e.target.value });
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  請輸入帳號
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} className="mb-2">
              <Form.Group controlId="formPwd" className="mb-2">
                <Form.Label style={{ cursor: "pointer" }}>密碼</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="請輸入密碼"
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, user_password: e.target.value });
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  請輸入密碼
                </Form.Control.Feedback>
              </Form.Group>
              <Link to="/forgetPassword" className="text-decoration-none">
                忘記密碼嗎?
              </Link>
            </Col>
            <Col md={6} xs={12}>
              <Form.Check
                type="checkbox"
                label="記住我"
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
            <Stack gap={1}>
              <BtnBootstrap
                btnSize="md"
                variant="outline-primary"
                btnType="submit"
                text="登入"
              />
              <BtnBootstrap
                btnSize="md"
                variant="outline-secondary"
                btnType="button"
                onClickEventName={() => {
                  fetchGuestLoginData();
                }}
                text={
                  <>
                    <MdEmojiPeople />
                    訪客登入
                  </>
                }
              />
            </Stack>
          </Row>
        </Form>
        <ToastAlert />
      </Container>
    );
  }
}
