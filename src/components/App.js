import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NewButton from "./NewButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PRE_QUESTION = 30;

const initialState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: 10,
  maxQuestions: null,
  diffcultyQuestions: null,
};

function reducer(state, actoin) {
  switch (actoin.type) {
    case "dataReceived":
      return { ...state, questions: actoin.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PRE_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: actoin.payload,
        points:
          actoin.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index:
          state.index < (state.maxQuestions ?? state.questions.length)
            ? state.index + 1
            : state.index,
        answer: null,
        status:
          state.index === state.maxQuestions - 1 ? "finished" : state.status,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.highscore > state.points ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };
    case "decrease":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "Maximum":
      return { ...state, maxQuestions: actoin.payload };
    case "diffcult":
      console.log(
        state.questions.filter((q) => q.degree === "diffcult").length
      );
      return {
        ...state,
        diffcultyQuestions: state.questions.filter(
          (q) => q.degree === "diffcult"
        ),
        maxQuestions: state.questions.filter((q) => q.degree === "diffcult")
          .length,
      };
    default:
      throw new Error("action unknown");
  }
}
export default function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      maxQuestions,
      diffcultyQuestions,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions?.length;
  const maxPossiablePoints = questions?.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch(
      "https://github.com/S-Aboosh/React-Quiz/blob/main/data/questions.json"
    )
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch(dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={maxQuestions ?? numQuestions}
            dispatch={dispatch}
            questions={questions}
            maxQuestions={maxQuestions}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiablePoints={maxPossiablePoints}
              answer={answer}
              maxQuestions={maxQuestions}
            />

            <Question
              question={
                diffcultyQuestions
                  ? diffcultyQuestions[index]
                  : questions[index]
              }
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NewButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestion={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiablePoints={maxPossiablePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
        {/* {status === "restart" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )} */}
      </Main>
    </div>
  );
}
