import React from "react";
import Cell from "./Cell";

export default function Grid() {
  const rows = 10;
  const cols = 20;
  const [gameOver, setGameOver] = React.useState(true);
  const [currDir, setCurrDir] = React.useState("r");
  const [hscore, setHscore] = React.useState(0);
  const [gameState, setGameState] = React.useState({
    foodRow: Math.floor(Math.random() * rows),
    foodCol: Math.floor(Math.random() * cols),
    headRow: Math.floor(rows / 2),
    headCol: Math.floor(cols / 2),
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
  // problem: currDir only takes value at time of eventlistener add
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
    gameState.tail.push({ row: gameState.headRow, col: gameState.headCol });
    gameState.tail.shift();
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
      gameState.tail.push({ row: gameState.foodRow, col: gameState.foodCol });
      if (gameState.tail.length > hscore) setHscore(gameState.tail.length);
      setGameState({
        ...gameState,
        foodRow: Math.floor(Math.random() * rows),
        foodCol: Math.floor(Math.random() * cols),
      });
    }
  };

  const checkDie = () => {
    gameState.tail.forEach((e) => {
      if (e.row === gameState.headRow && e.col === gameState.headCol)
        console.log("die");
      //setGameOver(true);
    });
  };

  // ticking
  // TODO: fix lag (or checkConsume still using prevState?)
  // affects dying too
  const tick = () => {
    moveSnake();
    checkDie();
    checkConsume();
  };

  // TODO: fix interval fn using the same prevState (ticks, but prevState+1 = currState = no movement)
  // temporary fix: gameState as dep, essentially re-running effect every render
  React.useEffect(() => {
    const interval = gameOver ? {} : setInterval(() => tick(), 200);
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
        <div>score={gameState.tail.length}</div>
        <div>high score={hscore}</div>
        <button onClick={startGame}>start</button>
        <button onClick={stopGame}>pause</button>
        <button onClick={restartScore}>restart</button>
        <br />
        <br />
      </div>

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
        <br />
        <div>for debugging</div>
        <button onClick={tick}>tick</button>
        <br />
        <button onClick={moveSnake}>moveSnake</button>
        <button onClick={checkDie}>checkDie</button>
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
  );
}
