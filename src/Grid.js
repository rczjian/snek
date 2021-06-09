import React from "react";
import Cell from "./Cell";

export default function Grid() {
  const rows = 10;
  const cols = 10;
  const [gameOver, setGameOver] = React.useState(true);
  const [currDir, setCurrDir] = React.useState("r");
  const [gameState, setGameState] = React.useState({
    foodRow: 2,
    foodCol: 2,
    headRow: 3,
    headCol: 4,
    tail: [],
  });

  const restartScore = () =>
    setGameState({
      ...gameState,
      tail: [],
    });
  const startGame = () => setGameOver(false);
  const stopGame = () => setGameOver(true);

  // key handling
  // TODO: prevent changing to opposite direction
  const handleKeyDown = (e) => {
    if (e.code === "ArrowDown") {
      setCurrDir("d");
    } else if (e.code === "ArrowUp") {
      setCurrDir("u");
    } else if (e.code === "ArrowLeft") {
      setCurrDir("l");
    } else if (e.code === "ArrowRight") {
      setCurrDir("r");
    }
  };

  React.useEffect(() => {
    if (!gameOver) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver]);

  // snake movement
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
      //incrementScore();
      gameState.tail.push({ row: 2, col: 2 });
      do {
        setGameState({
          ...gameState,
          foodRow: Math.floor(Math.random() * rows),
          foodCol: Math.floor(Math.random() * cols),
        });
      } while (false);
    }
  };

  // ticking
  // TODO: fix lag (or checkConsume still using prevState?)
  const tick = () => {
    moveSnake();
    checkConsume();
  };

  // TODO: fix interval fn using prevState
  // temporary fix: gameState as dep, essentially re-running effect every render
  React.useEffect(() => {
    const interval = gameOver
      ? console.log("game over")
      : setInterval(() => tick(), 500);
    return () => {
      clearInterval(interval);
    };
  }, [gameState, gameOver]);

  // rendering grid
  const cells = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const isFood = i === gameState.foodRow && j === gameState.foodCol;
      const isHead = i === gameState.headRow && j === gameState.headCol;
      let isTail = false;
      gameState.tail.forEach((e) => {
        if (e.row === i && e.col === j) isTail = true;
      });
      cells.push({
        isFood,
        isHead,
        isTail,
      });
    }
  }

  return (
    <div>
      <div>
        <div>debugging 1</div>
        <div>score={gameState.tail.length}</div>
        <button onClick={startGame}>start</button>
        <button onClick={stopGame}>stop</button>
        <button onClick={restartScore}>restart</button>
      </div>
      {gameOver ? (
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
                <Cell
                  isFood={cell.isFood}
                  isHead={cell.isHead}
                  isTail={cell.isTail}
                  currDir={currDir}
                />
              );
            })}
          </div>
          <div>
            <div>debugging 2</div>
            <button onClick={tick}>tick</button>
            <button onClick={moveSnake}>moveSnake</button>
            <button onClick={checkConsume}>checkConsume</button>
            <br />
            <button onClick={() => setCurrDir("l")}>left</button>
            <button onClick={() => setCurrDir("r")}>right</button>
            <button onClick={() => setCurrDir("u")}>up</button>
            <button onClick={() => setCurrDir("d")}>down</button>
            <br />
            <button onClick={() => console.log(gameState)}>gameState</button>
            <button onClick={() => console.log(gameState.tail)}>tail</button>
          </div>
        </div>
      )}
    </div>
  );
}
