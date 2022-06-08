import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { decode } from "html-entities";
import { nanoid } from "nanoid";
import Question from "./Question";

import Confetti from "react-confetti";

function App() {
  // this state determines if first page is showing up or the second page of the game
  const [firstPage, SetFirstPage] = useState(true);
  // this state gets the data from api and pass it to the allData state
  const [APIData, setAPIData] = useState(() => []);
  // i just declared this state because i felt like when i try to directly make changes to the api data, api calls again and the game crashes. it did work but it might be better if i can find another solution
  const [allData, setAllData] = useState(() => []);
  // this state keeps track of the score.with every correct answer it increases
  const [score, setScore] = useState(0);
  // this state keep track of the starting and enfing of game. if player clicks on check answers button then this state turns to be true and then the player can not make any other changes to answers
  const [finished, setFinished] = useState(false);

  // im trying to have a  function that makes api call and also stores the data ordinarily in a new object onto the state
  // i also used useCallback to be bale to reduce number of times that api makes calls but i couldn figure it out yet.
  const fetchData = useCallback(() => {
    fetch(
      "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
    )
      .then((response) => response.json())
      .then((data) => {
        setAPIData(
          data.results.map((res) => {
            let gottenAnswers = [
              {
                text: decode(res.correct_answer),
                correct: true,
                id: nanoid(),
                selected: false,
                style: {},
              },
              {
                text: decode(res.incorrect_answers[0]),
                correct: false,
                id: nanoid(),
                selected: false,
                style: {},
              },
              {
                text: decode(res.incorrect_answers[1]),
                correct: false,
                id: nanoid(),
                selected: false,
                style: {},
              },
              {
                text: decode(res.incorrect_answers[2]),
                correct: false,
                id: nanoid(),
                selected: false,
                style: {},
              },
            ];
            return {
              question: { text: decode(res.question), id: nanoid() },
              answers: gottenAnswers.sort(() => Math.random() - 0.5),
            };
          })
        );
      });
  }, [firstPage]);

  useEffect(() => {
    fetchData();
    if (!firstPage) {
      setAllData(APIData);
      setFinished(false);
      setScore(0);
    }
  }, [firstPage]);

  // so this function just takes us to the second page or takes us back to the first page by clicking the start game btton
  const firstPageHandleClick = () => {
    SetFirstPage((preValue) => !preValue);
  };
  //here im going to handle the answer that have been selected
  function handleAnswerClick(answerId, questionId) {
    if (finished === false) {
      setAllData((previousData) => {
        let data = [...previousData];
        data.map((eachDatum) => {
          if (questionId === eachDatum.question.id) {
            return eachDatum.answers.map((eachAnswer) => {
              return eachAnswer.id === answerId
                ? (eachAnswer.selected = true)
                : (eachAnswer.selected = false);

              // old code:
              // if (eachAnswer.id === answerId) {
              //   return (eachAnswer.selected = true);
              // } else {
              //   return (eachAnswer.selected = false);
              // }
            });
          }
        });
        return data;
      });
    }
  }

  // this function here takes all the data and turn them all into jsx hat could be shared on screen
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
              className={`qa--answer-button ${
                eachAnswer.selected && "selected"
              }`}
              style={eachAnswer.style}
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

  // this is the style variable that we will use for different outcomes for answers based on user input
  const checkAnswerStyles = [
    {
      wrongAnswer: {
        backgroundColor: "#F8BCBC",
        color: "#293264",
      },
    },
    {
      rightAnswer: {
        backgroundColor: "#94D7A2",
        fontWeight: "bold",
      },
    },
  ];

  // this function will check if the user selected the right or wrong question. clicking on check Answers button will trigger this function
  function checkAnswers() {
    if (finished === false) {
      setAllData((previousData) => {
        let data = [...previousData];
        data.map((datum) => {
          datum.answers.map((answer) => {
            if (answer.selected) {
              if (answer.correct) {
                setScore((preScore) => preScore + 1);
                answer.style = checkAnswerStyles[1].rightAnswer;
              } else {
                answer.style = checkAnswerStyles[0].wrongAnswer;
              }
            } else {
              if (answer.correct) {
                answer.style = checkAnswerStyles[1].rightAnswer;
              }
            }
          });
        });
        return data;
      });
      setFinished(true);
    }
  }

  console.log(APIData);

  // starting of <App /> ==>
  return (
    <div
      className={
        firstPage ? "App fade-in first-page-app" : "App fade-in second-page"
      }
    >
      {/* first page ==> */}
      {firstPage ? (
        <div className="first-page fade-in">
          <h1 className="first-page--title">Quizzical</h1>
          <p className="first-page--description">Some description if needed</p>
        </div>
      ) : (
        /* <==first page */
        /* Question Page ==> */
        <div className="question-page-container fade-in">
          {APIData.length > 1 ? (
            <div className="questions fade-in">{allThingsTogether()}</div>
          ) : (
            <p className="loading">Loading...</p>
          )}

          <button onClick={checkAnswers} className="btn check-answers">
            Check Answers
          </button>
        </div>
      )}
      {!firstPage && finished && (
        <div className="score-placeholder">
          <p className="score">
            Your Score is <strong>{score}</strong>
          </p>
          <p> Would you like to Try again? ==> </p>
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
      {!firstPage && finished && score === 5 && <Confetti />}
    </div>
  );
}

export default App;

// https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple  link for 5 question with easy difficulity
