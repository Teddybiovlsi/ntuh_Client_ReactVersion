import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
  Stack,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { RiAlertFill } from 'react-icons/ri';
import { GoCheckCircleFill } from 'react-icons/go';
import { RxCrossCircled } from 'react-icons/rx';
import jsSHA from 'jssha';

import PageTitleHeading from '../../components/PageTitleHeading';
import ToastAlert from '../../components/ToastAlert';
import useModal from '../../js/useModal';
import { post } from '../axios';
import { clearUserSession } from '../../js/userAction';
import styles from '../../styles/Form/ClientBasicVideoQuestionPage.module.scss';

export default function BasicVideoQuestionPage({ user }) {
  const checkPermission = user.permission === 'ylhClient';

  const location = useLocation();

  // 建立一個ref來存儲每個問題的卡片元素
  const questionRefs = useRef([]);

  const { info, videoID } = location.state || {};

  const [needShuffle, setNeedShuffle] = useState(true);

  const [currentInfo, setCurrentInfo] = useState(info);

  const [haveFirstSubmit, setHaveFirstSubmit] = useState(false);

  const [shuffledInfo, setShuffledInfo] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({});

  const [disabledRepeatSubmit, setDisabledRepeatSubmit] = useState(false);

  const [answerCount, setAnswerCount] = useState(0);

  const [score, setScore] = useState(0);

  const navigate = useNavigate();

  const [notFinishModal, handleCloseNotFinishModal, handleShowNotFinishModal] =
    useModal();

  const [scoreModal, handleCloseScoreModal, handleShowScoreModal] = useModal();

  const uploadTheAnswer = async (data, isReloadingPage = false) => {
    // let alertToastID = toast.loading("上傳中...");
    try {
      const response = await post(
        `client/record/basic/${user.client_token}`,
        data
      );
      setScore(0);

      if (isReloadingPage) {
        handleCloseScoreModal();
      } else {
        handleCloseScoreModal();
      }
    } catch (error) {
      if (error.response.data.error === 'Token expired') {
        alert('登入逾時，請重新登入！');
        clearUserSession();
        navigate('/', { replace: true });
      } else {
        toast.error('上傳紀錄失敗，請稍後再試', {
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
      setCurrentInfo((prevInfo) =>
        prevInfo.map((info) => {
          if (info.basic_id === questionId) {
            return {
              ...info,
              haveAnswered: true,
            };
          } else {
            return info;
          }
        })
      );
    },
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // 檢查哪些問題沒有被回答
    const unansweredQuestions = currentInfo.filter(
      (info) => !selectedOptions[info.basic_id]
    );

    if (unansweredQuestions.length > 0) {
      handleShowNotFinishModal();
      return;
    }

    setHaveFirstSubmit(true);

    // console.log("unansweredQuestions", unansweredQuestions);

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
    // 將已經正確的答案設定為不可再次選擇
    const updatedInfo = currentInfo.map((info) => {
      if (selectedOptions[info.basic_id].isCorrect === 1) {
        return {
          ...info,
          isDisableTheOption: true,
        };
      } else {
        return info;
      }
    });

    setCurrentInfo(updatedInfo);
    handleShowScoreModal();
    setDisabledRepeatSubmit(true);
  };

  const hashTheKeyText = (keyText) => {
    const shaObj = new jsSHA('SHA-256', 'TEXT');
    shaObj.update(keyText);
    const hash = shaObj.getHash('HEX');
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

  const renderIcon = (index) => {
    const info = currentInfo[index];
    if (info.haveAnswered === false) {
      return <RiAlertFill className='text-warning m-0 me-2 h3' />;
    }
    if (info.isDisableTheOption) {
      return <GoCheckCircleFill className='text-success m-0 me-2 h3' />;
    }
    if (info.isDisableTheOption === false && haveFirstSubmit === true) {
      return <RxCrossCircled className='text-danger m-0 me-2 h3' />;
    }
    return null;
  };

  useEffect(() => {
    const updatedInfo = currentInfo.map((item) => ({
      ...item,
      haveAnswered: false,
      isDisableTheOption: false, // 新增一個變數用來判斷是否已經正確
    }));
    setCurrentInfo(updatedInfo);
  }, [info]);

  useEffect(() => {
    if (needShuffle) {
      const shuffledInfos = currentInfo.map((info) => handleShuffle(info));
      setShuffledInfo(shuffledInfos);
      setNeedShuffle(false);
    }
  }, [needShuffle, currentInfo]);

  return (
    <>
      <PageTitleHeading text='基礎練習題目測驗' styleOptions={4} />
      <Container className='pb-5'>
        <Form noValidate onSubmit={handleSubmit}>
          {shuffledInfo.map((question, index) => {
            return (
              <Card
                key={`card-${question.basic_id}`}
                className='mb-2'
                border={
                  currentInfo[index].isDisableTheOption ? 'success' : 'danger'
                }
              >
                <Card.Header>
                  <Card.Title className='m-0'>
                    {renderIcon(index)}
                    <b className='me-2'>({index + 1})</b>
                    {question.video_question}
                  </Card.Title>
                </Card.Header>
                <CardBody>
                  <Row key={`row-option`}>
                    {Object.keys(question.choice).map((key, index2) => {
                      // console.log("question", question.video_question);
                      return (
                        <Col
                          md={6}
                          as='label'
                          key={`label-${key}`}
                          htmlFor={`basic${question.basic_id}${index2}`}
                          style={{ cursor: 'pointer' }}
                          className={styles.labelOption}
                        >
                          <Form.Check
                            type='radio'
                            label={question.choice[key][0]}
                            name={`basic${question.basic_id}`}
                            key={question.choice[key][0]}
                            id={`basic${question.basic_id}${index2}`}
                            onChange={() =>
                              handleOptionChange(
                                question.basic_id,
                                question.choice[key][1],
                                question.choice[key][0]
                              )
                            }
                            disabled={currentInfo[index].isDisableTheOption}
                            required
                          />
                          {question.choice[key][2] && (
                            <div className='d-flex justify-content-center'>
                              <Image
                                src={`${question.choice[key][2]}`}
                                alt={`basic${question.basic_id}${index2}`}
                                rounded
                                fluid
                                className='mt-3'
                                style={{
                                  maxHeight: '200px',
                                  cursor: 'pointer',
                                }}
                              />
                            </div>
                          )}
                        </Col>
                      );
                    })}
                  </Row>
                  {
                    // 若錯誤次數達到2次，顯示正確答案
                    answerCount >= 2 && currentInfo[index].isDisableTheOption === false && (
                      <Row>
                        <Col>
                          {
                            (() => {
                              const correctAnswerKey = Object.keys(question.choice).find(key => question.choice[key][1] === 1);
                              if (correctAnswerKey) {
                                return (
                                  <p
                                    key={`correct-answer-${correctAnswerKey}`}
                                    className='text-success m-0 fs-5'
                                  >
                                    正確答案為：{question.choice[correctAnswerKey][0]}
                                  </p>
                                );
                              }
                            })()
                          }
                        </Col>
                      </Row>
                    )
                  }
                </CardBody>
              </Card>
            );
          })}
          <Stack gap={1}>
            {score < 100 && answerCount < 2 ? (
              <Button
                variant='danger'
                type='submit'
                size='md'
                className='fixed-bottom'
              >
                送出答案
              </Button>
            ) : (
              <Button
                variant='secondary'
                type='button'
                size='md'
                className='fixed-bottom'
                onClick={() => {
                  navigate('/basic', { replace: true });
                }}
              >
                回到基礎練習
              </Button>
            )}
          </Stack>
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
          <h3 className={score >= 100 ? 'text-success' : 'text-danger'}>
            {`本次分數為: ${score}分`}
            {score >= 100 && (
              <>
                <br />
                <b className='text-success'>你很棒喔，恭喜拿到滿分！</b>
              </>
            )}
          </h3>
          <p>
            {score < 100
              ? answerCount < 2
                ? '是否要再重新練習看看呢？'
                : '下次再努力，你一定可以拿到滿分的分數！'
              : null}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Stack gap={3}>
            {score < 100 && answerCount < 2 && (
              <Button
                variant='outline-primary'
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
              variant='outline-secondary'
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
                  if (score === 100) {
                    navigate('/basic', { replace: true });
                  }
                } else {
                  navigate('/basic', { replace: true });
                }
              }}
            >
              結束
            </Button>
          </Stack>
        </Modal.Footer>
      </Modal>
      <Modal show={notFinishModal} onHide={handleCloseNotFinishModal}>
        <Modal.Header>
          <Modal.Title>尚有未完成的題目</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='h3 text-danger'>請確認題目欄位是否有警告標誌</p>
          <p className='h4'>請依照出現警告標誌進行作答</p>
        </Modal.Body>
        <Modal.Footer>
          <Stack gap={1}>
            <Button
              variant='outline-secondary'
              onClick={handleCloseNotFinishModal}
            >
              確認
            </Button>
          </Stack>
        </Modal.Footer>
      </Modal>
    </>
  );
}
