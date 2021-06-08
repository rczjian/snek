import React from "react";
import Grid from "./Grid";

export default function Game() {
  const [score, setScore] = React.useState(0);
  const incrementScore = () => setScore(score + 1);
  const restartScore = () => setScore(0);

  const [gameOver, setGameOver] = React.useState(false);
  const startGame = () => setGameOver(false);
  const stopGame = () => setGameOver(true);

  return (
    <div>
      <div>score={score}</div>
      <button onClick={startGame}>start</button>
      <button onClick={stopGame}>stop</button>
      <button onClick={incrementScore}>increment</button>
      <button onClick={restartScore}>restart</button>
      <Grid
        rows={10}
        cols={10}
        gameOver={gameOver}
        setGameOver={setGameOver}
        incrementScore={incrementScore}
      />
    </div>
  );
}
