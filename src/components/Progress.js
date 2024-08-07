function Progress({
  index,
  numQuestions,
  points,
  maxPossiablePoints,
  answer,
  maxQuestions,
}) {
  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong> / {maxQuestions ?? numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPossiablePoints}
      </p>
    </header>
  );
}

export default Progress;
