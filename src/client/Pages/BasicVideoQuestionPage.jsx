import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Container, Form, Modal, Row, Stack } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import PageTitleHeading from "../../components/PageTitleHeading";
import jsSHA from "jssha";
import BtnBootstrap from "../../components/BtnBootstrap";
import { post } from "../axios";
import ToastAlert from "../../components/ToastAlert";
import { toast } from "react-toastify";
import useModal from "../../js/useModal";

export default function BasicVideoQuestionPage() {
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user")
  );

  const location = useLocation();

  const info = location.state?.info;

  const videoID = location.state?.videoID;

  const [currentInfo, setCurrentInfo] = useState(info);

  const [shuffledInfo, setShuffledInfo] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({});

  const [disabledRepeatSubmit, setDisabledRepeatSubmit] = useState(false);

  // const [showTheScoreModal, setShowTheScoreModal] = useState(false);
  const [scoreModal, handleCloseScoreModal, handleShowScoreModal] = useModal();

  const [score, setScore] = useState(0);

  const navigate = useNavigate();

  const uploadTheAnswer = async (data, isReloadingPage = false) => {
    let alertToastID = toast.loading("上傳中...");
    try {
      const response = await post(
        `client/record/basic/${user.client_token}`,
        data
      );

      if (isReloadingPage) {
        navigate(0);
      } else {
        toast.update(alertToastID, {
          render: "上傳成功，3秒後將自動跳轉至首頁",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    } catch (error) {
      if (error.response.data.error === "Token expired") {
        alert("登入逾時，請重新登入！");
        localStorage.getItem("user") && localStorage.removeItem("user");
        sessionStorage.getItem("user") && sessionStorage.removeItem("user");
        navigate("/", { replace: true });
      } else {
        if (isReloadingPage) {
          navigate(0);
        } else {
          toast.update(alertToastID, {
            render: "上傳失敗，請稍後再試",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          setTimeout(() => {
            setDisabledRepeatSubmit(false);
          }, 3000);
        }
      }
    }
  };

  const handleOptionChange = (
    questionId,
    selectedOption,
    selectedOptionAnswer
  ) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionId]: {
        quiz_id: questionId,
        isCorrect: selectedOption,
        answer: selectedOptionAnswer,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const lengthOfQuestions = currentInfo.length;

    // console.log("lenthOfQuestions", lengthOfQuestions);
    // console.log("selectedOptions", selectedOptions);

    const correctAnswers = currentInfo.filter(
      (info) => selectedOptions[info.basic_id].isCorrect === 1
    );

    const wrongAnswers = currentInfo.filter(
      (info) => selectedOptions[info.basic_id].isCorrect === 0
    );
    // console.log("correctAnswers", correctAnswers);
    // console.log("wrongAnswers", wrongAnswers);

    // 滿分為100分，若題目無法整除，則以四捨五入計算
    const score = Math.round((correctAnswers.length / lengthOfQuestions) * 100);

    setScore(score);
    handleShowScoreModal();
    setDisabledRepeatSubmit(true);
  };

  const hashTheKeyText = (keyText) => {
    const shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(keyText);
    const hash = shaObj.getHash("HEX");
    return hash;
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const handleShuffle = (info) => {
    const values = Object.values(info.choice);
    const shuffledValues = shuffleArray(values);

    const newChoice = Object.keys(info.choice).reduce((result, key, index) => {
      result[key] = shuffledValues[index];
      return result;
    }, {});

    return { ...info, choice: newChoice };
  };

  useEffect(() => {
    const shuffledInfos = currentInfo.map((info) => handleShuffle(info));
    setShuffledInfo(shuffledInfos);
  }, []);

  return (
    <>
      <PageTitleHeading text="基礎練習題目測驗" styleOptions={4} />
      <Container>
        <Form onSubmit={handleSubmit}>
          {shuffledInfo.map((question, index) => {
            return (
              <div key={question.basic_id}>
                <p className="fs-4 m-0">
                  {`第${index + 1}題.`}
                  {question.video_question}
                </p>

                {Object.keys(question.choice).map((key, index) => {
                  // console.log("question", question.video_question);
                  return (
                    <Form.Check
                      type="radio"
                      label={question.choice[key][0]}
                      name={`basic${question.basic_id}`}
                      key={question.choice[key][0]}
                      id={`basic${question.basic_id}${index}`}
                      onChange={() =>
                        handleOptionChange(
                          question.basic_id,
                          question.choice[key][1],
                          question.choice[key][0]
                        )
                      }
                      required
                    />
                  );
                })}
              </div>
            );
          })}
          <Button
            variant="outline-primary"
            type="submit"
            className="mt-3 float-end"
            disabled={disabledRepeatSubmit}
            size="md"
          >
            送出
          </Button>
        </Form>
      </Container>
      <ToastAlert />
      <Modal show={scoreModal} onHide={handleCloseScoreModal}>
        <Modal.Header>
          <Modal.Title>本次基礎練習結果</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 className={score > 60 ? "text-success" : "text-danger"}>
            {`本次分數為: ${score}分`}
            {score < 60 && <b className="text-danger">，請再接再厲！</b>}
          </h3>
          <p>是否要重新練習？</p>
        </Modal.Body>
        <Modal.Footer>
          <Stack gap={3}>
            <Button
              variant="outline-primary"
              onClick={() => {
                const data = {
                  checkID: videoID,
                  accuracy: score,
                  answer: JSON.stringify(selectedOptions),
                };
                uploadTheAnswer(data, true);
              }}
            >
              再次練習
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => {
                uploadTheAnswer(
                  {
                    checkID: videoID,
                    accuracy: score,
                    answer: JSON.stringify(selectedOptions),
                  },
                  false
                );
              }}
            >
              結束
            </Button>
          </Stack>
        </Modal.Footer>
      </Modal>
    </>
  );
}
