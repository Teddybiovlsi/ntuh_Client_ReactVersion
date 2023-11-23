import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Form,
  Image,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import { toast } from "react-toastify";
import jsSHA from "jssha";

import PageTitleHeading from "../../components/PageTitleHeading";
import ToastAlert from "../../components/ToastAlert";
import useModal from "../../js/useModal";
import { post } from "../axios";
import { clearUserSession } from "../../js/userAction";

export default function BasicVideoQuestionPage({ user }) {
  const checkPermission = user.permission === "ylhClient";

  const location = useLocation();

  const { info, videoID } = location.state || {};

  const [currentInfo, setCurrentInfo] = useState(info);

  const [shuffledInfo, setShuffledInfo] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({});

  const [disabledRepeatSubmit, setDisabledRepeatSubmit] = useState(false);

  const [answerCount, setAnswerCount] = useState(0);

  const [scoreModal, handleCloseScoreModal, handleShowScoreModal] = useModal();

  const [score, setScore] = useState(0);

  const navigate = useNavigate();

  const uploadTheAnswer = async (data, isReloadingPage = false) => {
    // let alertToastID = toast.loading("上傳中...");
    try {
      const response = await post(
        `client/record/basic/${user.client_token}`,
        data
      );

      if (isReloadingPage) {
        handleCloseScoreModal();
      } else {
        toast.success("上傳紀錄成功，3秒後將自動跳轉自首頁", {
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 3000);
      }
    } catch (error) {
      if (error.response.data.error === "Token expired") {
        alert("登入逾時，請重新登入！");
        clearUserSession();
        navigate("/", { replace: true });
      } else {
        toast.error("上傳紀錄失敗，請稍後再試", {
          autoClose: 3000,
        });
        setTimeout(() => {
          setDisabledRepeatSubmit(false);
        }, 3000);
      }
    }
  };

  const handleOptionChange = useCallback(
    (questionId, selectedOption, selectedOptionAnswer) => {
      setSelectedOptions((prevOptions) => ({
        ...prevOptions,
        [questionId]: {
          quiz_id: questionId,
          isCorrect: selectedOption,
          answer: selectedOptionAnswer,
        },
      }));
    },
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnswerCount((preCount) => preCount + 1);

    const lengthOfQuestions = currentInfo.length;
    // 列出錯誤的題目
    const wrongQuestions = currentInfo.filter(
      (info) => selectedOptions[info.basic_id].isCorrect === 0
    );
    if (wrongQuestions.length === 0) {
      setScore(100);
    } else {
      currentInfo.forEach(({ basic_id, video_question_point }) => {
        if (selectedOptions[basic_id].isCorrect === 1) {
          setScore((preScore) =>
            Math.round(Number(preScore) + Number(video_question_point))
          );
        }
      });
    }

    // 將錯誤的題目的答案加入到錯誤題目的物件中

    // 滿分為100分，若題目無法整除，則以四捨五入計算

    setCurrentInfo(wrongQuestions);
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
  }, [currentInfo]);

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
                    <Row key={`row-${key}`}>
                      <label
                        key={`label-${key}`}
                        htmlFor={`basic${question.basic_id}${index}`}
                      >
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
                        {question.choice[key][2] && (
                          <Image
                            src={`${question.choice[key][2]}`}
                            alt={`basic${question.basic_id}${index}`}
                            rounded
                            fluid
                            className="mt-3"
                            style={{ maxHeight: "200px", cursor: "pointer" }}
                          />
                        )}
                      </label>
                    </Row>
                  );
                })}
              </div>
            );
          })}
          <Button
            variant="outline-primary"
            type="submit"
            className="mt-3 float-end"
            // disabled={disabledRepeatSubmit}
            size="md"
          >
            送出
          </Button>
        </Form>
      </Container>
      <ToastAlert />
      <Modal
        show={scoreModal}
        onHide={() => {
          if (checkPermission) {
            uploadTheAnswer(
              {
                checkID: videoID,
                accuracy: score,
                answer: JSON.stringify(selectedOptions),
              },
              false
            );
          } else {
            handleCloseScoreModal();
          }
        }}
      >
        <Modal.Header>
          <Modal.Title>本次基礎練習結果</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 className={score >= 100 ? "text-success" : "text-danger"}>
            {`本次分數為: ${score}分`}
            {score >= 100 && (
              <>
                <br />
                <b className="text-success">你很棒喔，恭喜拿到滿分！</b>
              </>
            )}
          </h3>
          <p>
            {score < 100
              ? answerCount < 2
                ? "是否要再重新練習看看呢？"
                : "下次再努力，你一定可以拿到滿分的分數！"
              : null}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Stack gap={3}>
            {score < 100 && answerCount < 2 && (
              <Button
                variant="outline-primary"
                onClick={() => {
                  if (checkPermission) {
                    const data = {
                      checkID: videoID,
                      accuracy: score,
                      answer: JSON.stringify(selectedOptions),
                    };
                    uploadTheAnswer(data, true);
                  } else {
                    handleCloseScoreModal();
                  }
                }}
              >
                再次練習
              </Button>
            )}
            <Button
              variant="outline-secondary"
              onClick={() => {
                if (checkPermission) {
                  uploadTheAnswer(
                    {
                      checkID: videoID,
                      accuracy: score,
                      answer: JSON.stringify(selectedOptions),
                    },
                    false
                  );
                } else {
                  navigate("/Home", { replace: true });
                }
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
