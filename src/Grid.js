import React from "react";
import Cell from "./Cell";

export default function Grid() {
  const [rows, setRows] = React.useState(10);
  const [cols, setCols] = React.useState(20);
  const [tickInterval, setTickInterval] = React.useState(100);
  const [tempRows, setTempRows] = React.useState(10);
  const [tempCols, setTempCols] = React.useState(20);
  const [tempInterval, setTempInterval] = React.useState(100);
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
  const resetGameState = (r, c) => {
    setGameState({
      foodRow: Math.floor(Math.random() * r),
      foodCol: Math.floor(Math.random() * c),
      headRow: Math.floor(r / 2),
      headCol: Math.floor(c / 2),
      tail: [],
    });
  };

  const restartScore = () =>
    setGameState({
      ...gameState,
      tail: [],
    });
  const startGame = () => setGameOver(false);
  const stopGame = () => setGameOver(true);

  // key handling
  const handleKeyDown = (e) => {
    if (e.code === "ArrowDown" && currDir !== "u") {
      setCurrDir("d");
    } else if (e.code === "ArrowUp" && currDir !== "d") {
      setCurrDir("u");
    } else if (e.code === "ArrowLeft" && currDir !== "r") {
      setCurrDir("l");
    } else if (e.code === "ArrowRight" && currDir !== "l") {
      setCurrDir("r");
    }
    e.preventDefault();
  };

  React.useEffect(() => {
    if (!gameOver) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currDir, gameOver]);

  // snake movement
  const moveSnake = () => {
    gameState.tail.push({ row: gameState.headRow, col: gameState.headCol });
    gameState.tail.shift();

    let hrow = gameState.headRow;
    let hcol = gameState.headCol;

    if (currDir === "r") hcol = (gameState.headCol + 1) % cols;
    else if (currDir === "l")
      hcol = gameState.headCol === 0 ? cols - 1 : gameState.headCol - 1;
    else if (currDir === "u")
      hrow = gameState.headRow === 0 ? rows - 1 : gameState.headRow - 1;
    else hrow = (gameState.headRow + 1) % rows;

    setGameState({
      ...gameState,
      headRow: hrow,
      headCol: hcol,
    });

    return [hrow, hcol];
  };

  const checkDie = (hrow, hcol) => {
    gameState.tail.forEach((e) => {
      if (e.row === hrow && e.col === hcol) {
        console.log("die");
        setGameOver(true);
      }
    });
  };

  const checkConsume = (hrow, hcol) => {
    if (hrow === gameState.foodRow && hcol === gameState.foodCol) {
      gameState.tail.push({ row: gameState.foodRow, col: gameState.foodCol });
      if (gameState.tail.length > hscore) setHscore(gameState.tail.length);
      setGameState({
        ...gameState,
        headRow: hrow,
        headCol: hcol,
        foodRow: Math.floor(Math.random() * rows),
        foodCol: Math.floor(Math.random() * cols),
      });
    }
  };

  // ticking
  const tick = () => {
    const [hrow, hcol] = moveSnake();
    checkDie(hrow, hcol);
    checkConsume(hrow, hcol);
  };

  React.useEffect(() => {
    const interval = gameOver ? {} : setInterval(() => tick(), tickInterval);
    return () => {
      clearInterval(interval);
    };
  }, [gameState, gameOver]);

  // modifying grid size
  const handleRowsChange = (e) => {
    setTempRows(e.target.value === "" ? tempRows : e.target.value);
  };

  const handleColsChange = (e) => {
    setTempCols(e.target.value === "" ? tempCols : e.target.value);
  };

  const handleDimensionChange = () => {
    if (isNaN(tempRows) || isNaN(tempCols) || tempRows > 30 || tempCols > 30)
      console.log("not a number <= 30");
    else {
      setRows(tempRows);
      setCols(tempCols);
      resetGameState(tempRows, tempCols);
    }
  };

  // modifying snake speed
  const handleSpeedChange = (e) => {
    setTempInterval(e.target.value === "" ? tempInterval : e.target.value);
  };

  const handleIntervalChange = () => {
    if (isNaN(tempInterval) || tempInterval > 1000)
      console.log("not a number <= 1000");
    else setTickInterval(tempInterval);
  };

  // generating grid data
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
        <button onClick={() => checkDie(gameState.headRow, gameState.headCol)}>
          checkDie
        </button>
        <button
          onClick={() => checkConsume(gameState.headRow, gameState.headCol)}
        >
          checkConsume
        </button>
        <br />
        <button onClick={() => setCurrDir("l")}>left</button>
        <button onClick={() => setCurrDir("r")}>right</button>
        <button onClick={() => setCurrDir("u")}>up</button>
        <button onClick={() => setCurrDir("d")}>down</button>
        <button onClick={() => console.log(currDir)}>showCurrDir</button>
        <br />
        <button onClick={() => console.log(gameState)}>gameState</button>
        <button onClick={() => console.log(gameState.tail)}>tail</button>
        <br />
        <div>
          numRows:
          <input onChange={handleRowsChange} size={2} />
          <br />
          numCols:
          <input onChange={handleColsChange} size={2} />
          <br />
          <button onClick={handleDimensionChange}>submit dimensions</button>
        </div>
        <div>
          interval (ms):
          <input onChange={handleSpeedChange} size={4} />
          [current = {tickInterval}]
          <br />
          <button onClick={handleIntervalChange}>submit interval</button>
        </div>
      </div>
    </div>
  );
}
