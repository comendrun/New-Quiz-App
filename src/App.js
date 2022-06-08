import React, { useState, useEffect } from "react";
import "./App.css";
import { decode } from "html-entities";
import { nanoid } from "nanoid";
import Question from "./Question";
import Answer from "./Answer";

function App() {
  const [firstPage, SetFirstPage] = useState(true);
  // const [correct, setCorrect] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [APIData, setAPIData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [checkAnswers, setCheckAnswers] = useState(false);

  useEffect(() => {
    // if (firstPage === false) {
    fetch(
      "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.results);
        // setAPIData(data.results);
        // console.log(data.results);
        setAPIData(
          data.results.map((res) => {
            let gottenAnswers = [
              {
                text: decode(res.correct_answer),
                correct: true,
                id: nanoid(),
                selected: false,
              },
              {
                text: decode(res.incorrect_answers[0]),
                correct: false,
                id: nanoid(),
                selected: false,
              },
              {
                text: decode(res.incorrect_answers[1]),
                correct: false,
                id: nanoid(),
                selected: false,
              },
              {
                text: decode(res.incorrect_answers[2]),
                correct: false,
                id: nanoid(),
                selected: false,
              },
            ];
            return {
              question: { text: decode(res.question), id: nanoid() },
              answers: gottenAnswers.sort(() => Math.random() - 0.5),
            };
          })
        );
      });
    // }
  }, []);

  useEffect(() => {
    if (!firstPage) {
      setAllData(APIData);
    }
  }, [firstPage]);

  console.log(allData);

  const firstPageHandleClick = () => {
    SetFirstPage((preValue) => !preValue);
  };
  // --its a code i wrote before and i want to change it now with the code below. hope i can make it better : ==>
  // const allAnswers = [];
  // function getAnswers(i) {
  //   if (APIData.length > 1) {
  //     const answers = [
  //       {
  //         answer: decode(APIData[i].correct_answer),
  //         selected: false,
  //         correct: true,
  //         id: nanoid(),
  //       },
  //       {
  //         answer: decode(APIData[i].incorrect_answers[0]),
  //         selected: false,
  //         correct: false,
  //         id: nanoid(),
  //       },
  //       {
  //         answer: decode(APIData[i].incorrect_answers[1]),
  //         selected: false,
  //         correct: false,
  //         id: nanoid(),
  //       },
  //       {
  //         answer: decode(APIData[i].incorrect_answers[2]),
  //         selected: false,
  //         correct: false,
  //         id: nanoid(),
  //       },
  //     ].sort(() => Math.random() - 0.5);
  //     const randomizedAnswers = [...answers].map((everyAnswer) => (
  //       <button
  //         key={everyAnswer.id}
  //         className="qa--answer-button"
  //         onClick={() => {

  //           return !everyAnswer.selected;
  //         }}
  //       >
  //         {everyAnswer.answer}
  //       </button>
  //     ));
  //     allAnswers.push({ ...answers });
  //     return randomizedAnswers;
  //   }
  // }

  // function handleAnswerClick(id) {
  //   console.log(id);
  //   setAPIData((previousData) => {
  //     let data = [...previousData];
  //     data.map((eachPreDatum) => {
  //       console.log(eachPreDatum);
  //       return {
  //         ...eachPreDatum,
  //         answers: eachPreDatum.answers.map((eachPreAnswer) => {
  //           return (
  //             id === eachPreAnswer.id && console.log(eachPreAnswer)
  //             {
  //               ...eachPreAnswer,
  //               selected: true,
  //             }
  //           );
  //         }),
  //       };
  // TODO: i cant make this work. if i can make this work then i can disable other button in the same question so that other answers are not selected

  // if (id === eachPreAnswer.id) {
  //   return { ...eachPreAnswer, selected: !eachPreAnswer.selected };
  // }
  // });
  // console.log(data);
  // console.log(previousData);
  //     return data;
  //   });
  // }
  // console.log(APIData);

  function handleAnswerClick(answerId, questionId) {
    // console.log(answerId);
    // console.log(questionId);
    setAllData((previousData) => {
      let data = [...previousData];
      data.map((eachDatum) => {
        // console.log(eachDatum);
        if (questionId === eachDatum.question.id) {
          return eachDatum.answers.map((eachAnswer) => {
            if (eachAnswer.id === answerId) {
              eachAnswer.selected = true;
            } else {
              eachAnswer.selected = false;
            }
          });
        }
      });
      return data;
    });
  }

  const allThingsTogether = () => {
    if (allData.length > 0) {
      return allData.map((eachDatum) => {
        const answers = eachDatum.answers.map((eachAnswer) => {
          return (
            <button
              onClick={() =>
                handleAnswerClick(eachAnswer.id, eachDatum.question.id)
              }
              key={eachAnswer.id}
              className={`qa--answer-button`}
            >
              {eachAnswer.text}
            </button>
          );
        });
        return (
          <div key={nanoid()}>
            <Question question={eachDatum.question.text} />
            <div className="qa--answers"> {answers}</div>
          </div>
        );
      });
    }
  };
  // allThingsTogether();
  return (
    <div className={firstPage ? "App first-page-app" : "App second-page"}>
      {/* first page ==> */}
      {firstPage ? (
        <div className="first-page">
          <h1 className="first-page--title">Quizzical</h1>
          <p className="first-page--description">Some description if needed</p>
        </div>
      ) : (
        /* <==first page */
        /* Question Page ==> */
        <div className="question-page-container">
          {APIData.length > 1 ? (
            <div className="questions">
              {allThingsTogether()}
              {/*
              -- it's a code i wrote at first and worked. now i want to change it to another code:
               <div className="qa">
                <Question question={decode(APIData[0].question)} />
                <div className="qa--answers">{getAnswers(0)}</div>
              </div>
              <div className="qa">
                <Question question={decode(APIData[2].question)} />
                <div className="qa--answers">{getAnswers(2)}</div>
              </div>
              <div className="qa">
                <Question question={decode(APIData[3].question)} />
                <div className="qa--answers">{getAnswers(3)}</div>
              </div>
              <div className="qa">
                <Question question={decode(APIData[4].question)} />
                <div className="qa--answers">{getAnswers(4)}</div>
              </div>
              <div className="qa">
                <Question question={decode(APIData[1].question)} />
                <div className="qa--answers">{getAnswers(1)}</div>
              </div> */}
            </div>
          ) : (
            <p>Loading...</p>
          )}

          <button className="check-answers">Check Answers</button>
        </div>
      )}
      <button
        onClick={firstPageHandleClick}
        className={
          firstPage ? "btn first-page--button" : "btn second-page--button"
        }
      >
        {firstPage ? "Start Quiz" : "Start again"}
      </button>
      {/* <p>{allAnswers}</p> */}
    </div>
  );
}

export default App;

// https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple  link for 5 question with easy difficulity
