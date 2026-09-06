import React, { useState, useEffect } from "react";
import { Container, Form, Col, Row, Stack } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegQuestionCircle } from "react-icons/fa";
import { MdEmojiPeople } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";

import BtnBootstrap from "../../components/BtnBootstrap";
import ToastAlert from "../../components/ToastAlert";
import { get, post } from "../axios";
import { getUserSession, setUserSession } from "../../js/userAction";
import { getErrorMessage } from "../../js/api";

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
  // 送出中旗標，避免重複點擊觸發多次登入請求
  const [submitting, setSubmitting] = useState(false);

  const user = getUserSession();

  useEffect(() => {
    // user 可能為 null，需先檢查再讀取 permission
    if (!checkuserInfo && user?.permission === "ylhClient") {
      navigate("/Home");
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
    if (submitting) return;
    setSubmitting(true);

    let clientSubmit = toast.loading("登入中...");
    try {
      const response = await post("client/login", data);

      const userInfo = response.data;
      setTempUser(userInfo);

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
      // 逾時 / 網路中斷時 error.response 為 undefined，需統一處理
      toast.update(clientSubmit, {
        render: getErrorMessage(error, "登入失敗，請稍後再試"),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setSubmitting(false);
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
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await get("guest/temporaryToken");
      const guestInfo = response.data;

      setUserSession(guestInfo, false);
      navigate("/Home");
    } catch (error) {
      // 先前這裡直接 re-throw，但呼叫端沒有 catch，
      // 導致訪客登入失敗時完全靜默、使用者毫無感知。
      toast.error(getErrorMessage(error, "訪客登入失敗，請稍後再試"), {
        autoClose: 3000,
      });
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (tempuser !== null) {
      setUserSession(tempuser, userInfo.isRemember);
      setCheckuserInfo(tempuser);
    }
  }, [tempuser]);

  // 使用者資料只會存在於 localStorage 或 sessionStorage 其中之一，
  // 因此這裡必須用 && ：兩者皆無才代表未登入。
  // （原本誤用 || 會恆為 true，導致已登入者仍看到登入表單）
  const isLoggedOut =
    !localStorage.getItem("user") && !sessionStorage.getItem("user");

  if (!isLoggedOut) {
    return <Navigate to="/Home" replace />;
  }

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
                disabled={submitting}
                text="登入"
              />
              <BtnBootstrap
                btnSize="md"
                variant="outline-secondary"
                btnType="button"
                disabled={submitting}
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
