import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container, Form, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import PageTitleHeading from "../../components/PageTitleHeading";

export default function BasicVideoQuestionPage() {
  const location = useLocation();

  const info = location.state?.info;

  const [currentInfo, setCurrentInfo] = useState(info);

  const [shuffledInfo, setShuffledInfo] = useState([]);

  // 這用來對調陣列中的兩個元素，用來做洗牌問題options的順序
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    console.log("shuffledArray", shuffledArray.length);
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  };

  // 這用來對調陣列中的兩個元素，用來做洗牌問題options的順序
  const handleShuffle = (info) => {
    const newChoice = { ...info.choice };
    const values = Object.values(newChoice);
    const shuffledValues = shuffleArray(values);

    Object.keys(newChoice).forEach((key, index) => {
      newChoice[key] = shuffledValues[index];
    });
    const newShuffledInfo = { ...info, choice: newChoice };
    console.log("newShuffledInfo", newShuffledInfo);
    setShuffledInfo((prev) => [...prev, newShuffledInfo]);
  };

  useEffect(() => {
    currentInfo.forEach((info) => {
      handleShuffle(info);
    });

    // handleShuffle();
  }, []); // empty array as the second argument

  return (
    <>
      <PageTitleHeading text="基礎練習題目測驗" styleOptions={4} />
      <Container>
        <Form>
          {shuffledInfo.map((question, index) => {
            return (
              <div key={question.basic_id}>
                <p className="fs-4 m-0">
                  {`第${index + 1}題.`}
                  {question.video_question}
                </p>

                {Object.keys(question.choice).map((key, index) => {
                  console.log("question", question.video_question);
                  return (
                    <Form.Check
                      type="radio"
                      label={question.choice[key][0]}
                      name={`basic${question.basic_id}`}
                      key={question.choice[key][0]}
                      id={`basic${question.basic_id}${index}`}
                    />
                  );
                })}
              </div>
            );
          })}
        </Form>
      </Container>
    </>
  );
}
