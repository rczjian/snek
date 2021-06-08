import React from "react";
import Cell from "./Cell";

export default function Grid(props) {
  const rows = props.rows;
  const cols = props.cols;
  const gameOver = props.gameOver;
  const setGameOver = props.setGameOver;
  const incrementScore = props.incrementScore;
  const [currDir, setCurrDir] = React.useState("r");

  const [gameState, setGameState] = React.useState({
    foodRow: 2,
    foodCol: 2,
    headRow: 3,
    headCol: 4,
  });

  const moveSnake = () => {
    if (currDir === "r") {
      setGameState({
        ...gameState,
        headCol: (gameState.headCol + 1) % cols,
      });
    } else if (currDir === "l") {
      setGameState({
        ...gameState,
        headCol: gameState.headCol === 0 ? cols - 1 : gameState.headCol - 1,
      });
    } else if (currDir === "u") {
      setGameState({
        ...gameState,
        headRow: gameState.headRow === 0 ? rows - 1 : gameState.headRow - 1,
      });
    } else {
      setGameState({
        ...gameState,
        headRow: (gameState.headRow + 1) % rows,
      });
    }
  };

  const checkConsume = () => {
    if (
      gameState.headRow === gameState.foodRow &&
      gameState.headCol === gameState.foodCol
    ) {
      incrementScore();
      do {
        setGameState({
          ...gameState,
          foodRow: Math.floor(Math.random() * rows),
          foodCol: Math.floor(Math.random() * cols),
        });
      } while (false);
    }
  };

  const tick = () => {
    moveSnake();
    checkConsume();
    console.log(gameState);
  };

  const cells = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const isFood = i === gameState.foodRow && j === gameState.foodCol;
      const isHead = i === gameState.headRow && j === gameState.headCol;
      cells.push({
        isFood,
        isHead,
      });
    }
  }

  return gameOver ? (
    <div>game over :(</div>
  ) : (
    <div>
      <div
        style={{
          display: "flex",
          "flex-wrap": "wrap",
          height: 22 * rows,
          width: 22 * cols,
        }}
      >
        {cells.map((cell) => {
          return (
            <Cell isFood={cell.isFood} isHead={cell.isHead} currDir={currDir} />
          );
        })}
      </div>
      <div>
        <div>for debugging</div>
        <button onClick={tick}>tick</button>
        <button onClick={() => setCurrDir("l")}>left</button>
        <button onClick={() => setCurrDir("r")}>right</button>
        <button onClick={() => setCurrDir("u")}>up</button>
        <button onClick={() => setCurrDir("d")}>down</button>
      </div>
    </div>
  );
}
