import { useState } from "react";

function StartScreen({ numQuestions, dispatch, questions, maxQuestions }) {
  const [maxQ, setMaxQ] = useState(numQuestions);
  return (
    <div className="start">
      <h2>Welcome To The React Quiz!</h2>
      <button
        onClick={() =>
          dispatch({
            type: "diffcult",
          })
        }
      >
        diffcult
      </button>
      <h3>
        <input
          className="input"
          type="number"
          max={numQuestions}
          min={0}
          value={maxQuestions ?? maxQ}
          onChange={(e) => {
            dispatch({ type: "Maximum", payload: e.target.value });
            setMaxQ(e.target.value);
          }}
        />
        questions to test your react mastery
      </h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
