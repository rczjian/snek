import React from "react";
import Cell from "./Cell";

export default function Grid() {
  const rows = 10;
  const cols = 10;
  const [gameOver, setGameOver] = React.useState(true);
  const [currDir, setCurrDir] = React.useState("r");
  const [hscore, setHscore] = React.useState(0);
  const [gameState, setGameState] = React.useState({
    foodRow: Math.floor(Math.random() * rows),
    foodCol: Math.floor(Math.random() * cols),
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
  // problem: currDir only takes value "r"?
  const handleKeyDown = (e) => {
    if (e.code === "ArrowDown") {
      console.log(currDir);
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
      //     document.removeEventListener("keydown", handleKeyDown);
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
    checkConsume();
    checkDie();
  };

  // TODO: fix interval fn using prevState
  // temporary fix: gameState as dep, essentially re-running effect every render
  React.useEffect(() => {
    const interval = gameOver ? {} : setInterval(() => tick(), 500);
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
        <div>high score={hscore}</div>
        <button onClick={startGame}>start</button>
        <button onClick={stopGame}>pause</button>
        <button onClick={restartScore}>restart</button>
      </div>

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
          <button onClick={checkDie}>checkDie</button>
          <br />
          <button onClick={() => setCurrDir("l")}>left</button>
          <button onClick={() => setCurrDir("r")}>right</button>
          <button onClick={() => setCurrDir("u")}>up</button>
          <button onClick={() => setCurrDir("d")}>down</button>
          <button onClick={() => console.log(currDir)}>currDir</button>
          <button onClick={() => console.log(currDir !== "u")}>
            currDirIsUp
          </button>
          <br />
          <button onClick={() => console.log(gameState)}>gameState</button>
          <button onClick={() => console.log(gameState.tail)}>tail</button>
        </div>
      </div>
    </div>
  );
}
