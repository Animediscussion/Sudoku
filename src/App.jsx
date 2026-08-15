import { useEffect, useState } from "react";

import SudokuBoard from "./components/SudokuBoard";
import NumberPad from "./components/NumberPad";

import { generateSudoku, isValidMove } from "./utils/sudoku";

import "./App.css";
import Home from "./components/Home";

const MAX_MISTAKES = 3;

function App() {
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solution, setSolution] = useState([]);

  const [selectedCell, setSelectedCell] = useState(null);

  const [difficulty, setDifficulty] = useState("medium");

  const [error, setError] = useState("");

  const [mistakes, setMistakes] = useState(0);

  const [gameWon, setGameWon] = useState(false);

  const [gameOver, setGameOver] = useState(false);

  const [paused, setPaused] = useState(false);

  const [seconds, setSeconds] = useState(0);

  // ---------------------------------------------
  // Format timer
  // ---------------------------------------------

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);

    const remainingSeconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  // ---------------------------------------------
  // Start new game
  // ---------------------------------------------

  const startNewGame = (level = difficulty) => {
    const { puzzle, solution: generatedSolution } = generateSudoku(level);

    setBoard(puzzle);

    setInitialBoard(puzzle.map((row) => [...row]));

    setSolution(generatedSolution);

    setSelectedCell(null);

    setDifficulty(level);

    setMistakes(0);

    setError("");

    setGameWon(false);

    setGameOver(false);

    setPaused(false);

    setSeconds(0);
  };

  // ---------------------------------------------
  // Generate first game
  // ---------------------------------------------

  useEffect(() => {
    startNewGame("medium");
  }, []);

  // ---------------------------------------------
  // Timer
  // ---------------------------------------------

  useEffect(() => {
    if (paused || gameWon || gameOver || board.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [paused, gameWon, gameOver, board.length]);

  // ---------------------------------------------
  // Select cell
  // ---------------------------------------------

  const handleCellClick = (row, col) => {
    if (paused || gameWon || gameOver) {
      return;
    }

    setSelectedCell({
      row,
      col,
    });

    setError("");
  };

  // ---------------------------------------------
  // Check win
  // ---------------------------------------------

  const checkWin = (newBoard) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newBoard[row][col] !== solution[row][col]) {
          return false;
        }
      }
    }

    return true;
  };

  // ---------------------------------------------
  // Number input
  // ---------------------------------------------

  const handleNumberInput = (number) => {
    if (!selectedCell || paused || gameWon || gameOver) {
      return;
    }

    const { row, col } = selectedCell;

    // Original cell
    if (initialBoard[row][col] !== 0) {
      return;
    }

    // Sudoku rule
    if (!isValidMove(board, row, col, number)) {
      const newMistakes = mistakes + 1;

      setMistakes(newMistakes);

      setError(`${number} cannot be placed here`);

      if (newMistakes >= MAX_MISTAKES) {
        setGameOver(true);
      }

      return;
    }

    // Solution check
    if (solution[row][col] !== number) {
      const newMistakes = mistakes + 1;

      setMistakes(newMistakes);

      setError("Wrong number!");

      if (newMistakes >= MAX_MISTAKES) {
        setGameOver(true);
      }

      return;
    }

    const newBoard = board.map((currentRow) => [...currentRow]);

    newBoard[row][col] = number;

    setBoard(newBoard);

    setError("");

    if (checkWin(newBoard)) {
      setGameWon(true);
    }
  };

  // ---------------------------------------------
  // Clear cell
  // ---------------------------------------------

  const clearCell = () => {
    if (!selectedCell || paused || gameWon || gameOver) {
      return;
    }

    const { row, col } = selectedCell;

    if (initialBoard[row][col] !== 0) {
      return;
    }

    const newBoard = board.map((currentRow) => [...currentRow]);

    newBoard[row][col] = 0;

    setBoard(newBoard);

    setError("");
  };

  // ---------------------------------------------
  // Keyboard controls
  // ---------------------------------------------

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key >= "1" && event.key <= "9") {
        handleNumberInput(Number(event.key));
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        clearCell();
      }

      if (event.key === "Escape") {
        setPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedCell,
    board,
    initialBoard,
    solution,
    mistakes,
    paused,
    gameWon,
    gameOver,
  ]);

  // ---------------------------------------------
  // Restart current puzzle
  // ---------------------------------------------

  const restartGame = () => {
    setBoard(initialBoard.map((row) => [...row]));

    setSelectedCell(null);

    setMistakes(0);

    setError("");

    setGameWon(false);

    setGameOver(false);

    setPaused(false);

    setSeconds(0);
  };

  // ---------------------------------------------
  // Hint
  // ---------------------------------------------

  const handleHint = () => {
    if (!selectedCell || paused || gameWon || gameOver) {
      return;
    }

    const { row, col } = selectedCell;

    // Can't hint original cells
    if (initialBoard[row][col] !== 0) {
      return;
    }

    // Already solved
    if (board[row][col] !== 0) {
      return;
    }

    const newBoard = board.map((currentRow) => [...currentRow]);

    newBoard[row][col] = solution[row][col];

    setBoard(newBoard);

    setError("");

    if (checkWin(newBoard)) {
      setGameWon(true);
    }
  };

  // ---------------------------------------------
  // Difficulty
  // ---------------------------------------------

  const handleDifficultyChange = (event) => {
    const level = event.target.value;

    startNewGame(level);
  };

  // ---------------------------------------------
  // Progress
  // ---------------------------------------------

  const filledCells = board.flat().filter((value) => value !== 0).length;

  const progress = Math.round((filledCells / 81) * 100);

  // ---------------------------------------------
  // Loading
  // ---------------------------------------------

  if (board.length === 0) {
    return (
      <div className="app">
        <h1>Sudoku</h1>
        <p>Generating puzzle...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="game-container">
        {/* Header */}

        <div className="game-header">
          <div>
            <h1>Sudoku</h1>

            <p>Challenge your logic.</p>
          </div>

          <div className="timer">⏱ {formatTime(seconds)}</div>
        </div>

        {/* Stats */}

        <div className="game-info">
          <div className="info-item">
            <span>Difficulty</span>

            <strong>{difficulty.toUpperCase()}</strong>
          </div>

          <div className="info-item">
            <span>Mistakes</span>

            <strong>
              {mistakes}/{MAX_MISTAKES}
            </strong>
          </div>

          <div className="info-item">
            <span>Progress</span>

            <strong>{progress}%</strong>
          </div>
        </div>

        {/* Controls */}

        <div className="game-controls">
          <select
            value={difficulty}
            onChange={handleDifficultyChange}
            disabled={paused}
          >
            <option value="easy">Easy</option>

            <option value="medium">Medium</option>

            <option value="hard">Hard</option>
          </select>

          <button onClick={() => startNewGame()}>New Game</button>

          <button onClick={restartGame}>Restart</button>

          <button
            onClick={() => setPaused((prev) => !prev)}
            disabled={gameWon || gameOver}
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>

        {/* Progress */}

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* Board */}

        <div className={paused ? "board-paused" : ""}>
          <SudokuBoard
            board={board}
            initialBoard={initialBoard}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
          />
        </div>

        {/* Pause overlay */}

        {paused && (
          <div className="pause-message">
            <div className="pause-icon">⏸</div>

            <h2>Game Paused</h2>

            <p>Press Resume when you're ready.</p>
          </div>
        )}

        {/* Error */}

        {error && !paused && <div className="error-message">{error}</div>}

        {/* Number pad */}

        <NumberPad onNumberClick={handleNumberInput} onClear={clearCell} />

        {/* Hint */}

        <button
          className="hint-button"
          onClick={handleHint}
          disabled={paused || gameWon || gameOver}
        >
          💡 Hint
        </button>

        {/* Keyboard help */}

        <p className="keyboard-help">
          Select a cell and use 1–9 on your keyboard. Press Esc to pause.
        </p>

        {/* Win */}

        {gameWon && (
          <div className="win-message">
            <div className="win-icon">🎉</div>

            <h2>Puzzle Complete!</h2>

            <p>
              Time: <strong>{formatTime(seconds)}</strong>
            </p>

            <p>
              Mistakes: <strong>{mistakes}</strong>
            </p>

            <button onClick={() => startNewGame()}>Play Again</button>
          </div>
        )}

        {/* Game over */}

        {gameOver && !gameWon && (
          <div className="game-over-message">
            <div className="game-over-icon">💔</div>

            <h2>Game Over</h2>

            <p>You reached the maximum number of mistakes.</p>

            <button onClick={restartGame}>Try Again</button>

            <button onClick={() => startNewGame()}>New Puzzle</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
