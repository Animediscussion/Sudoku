import { useEffect, useState } from "react";

import SudokuBoard from "./components/SudokuBoard";
import NumberPad from "./components/NumberPad";

import { generateSudoku, isValidMove } from "./utils/sudoku";

import "./App.css";

function App() {
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solution, setSolution] = useState([]);

  const [selectedCell, setSelectedCell] = useState(null);

  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const [mistakes, setMistakes] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // ---------------------------------------------
  // Start new game
  // ---------------------------------------------

  const startNewGame = (level = difficulty) => {
    const { puzzle, solution: generatedSolution } = generateSudoku(level);

    setBoard(puzzle);

    setInitialBoard(puzzle.map((row) => [...row]));

    setSolution(generatedSolution);

    setSelectedCell(null);

    setError("");

    setMistakes(0);

    setGameWon(false);
  };

  // ---------------------------------------------
  // First game
  // ---------------------------------------------

  useEffect(() => {
    startNewGame("medium");
  }, []);

  // ---------------------------------------------
  // Cell click
  // ---------------------------------------------

  const handleCellClick = (row, col) => {
    if (gameWon) return;

    setSelectedCell({
      row,
      col,
    });

    setError("");
  };

  // ---------------------------------------------
  // Check if puzzle is complete
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
    if (!selectedCell || gameWon) return;

    const { row, col } = selectedCell;

    // Original puzzle cell
    if (initialBoard[row][col] !== 0) {
      return;
    }

    // Sudoku rule validation
    if (!isValidMove(board, row, col, number)) {
      setError(`${number} cannot be placed here`);

      setMistakes((prev) => prev + 1);

      return;
    }

    // Check against solution
    if (solution[row][col] !== number) {
      setError("Wrong number!");

      setMistakes((prev) => prev + 1);

      return;
    }

    // Create new board
    const newBoard = board.map((currentRow) => [...currentRow]);

    newBoard[row][col] = number;

    setBoard(newBoard);

    setError("");

    // Check win
    if (checkWin(newBoard)) {
      setGameWon(true);
      setError("");
    }
  };

  // ---------------------------------------------
  // Clear cell
  // ---------------------------------------------

  const clearCell = () => {
    if (!selectedCell || gameWon) return;

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
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell, board, initialBoard, solution, gameWon]);

  // ---------------------------------------------
  // Difficulty
  // ---------------------------------------------

  const handleDifficultyChange = (event) => {
    const level = event.target.value;

    setDifficulty(level);

    startNewGame(level);
  };

  // ---------------------------------------------
  // Progress
  // ---------------------------------------------

  const totalCells = 81;

  const filledCells = board.flat().filter((value) => value !== 0).length;

  const progress = Math.round((filledCells / totalCells) * 100);

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

            <p>Test your logic and solve the puzzle.</p>
          </div>
        </div>

        {/* Game information */}

        <div className="game-info">
          <div className="info-item">
            <span>Difficulty</span>

            <strong>{difficulty.toUpperCase()}</strong>
          </div>

          <div className="info-item">
            <span>Mistakes</span>

            <strong>{mistakes}</strong>
          </div>

          <div className="info-item">
            <span>Progress</span>

            <strong>{progress}%</strong>
          </div>
        </div>

        {/* Controls */}

        <div className="game-controls">
          <select value={difficulty} onChange={handleDifficultyChange}>
            <option value="easy">Easy</option>

            <option value="medium">Medium</option>

            <option value="hard">Hard</option>
          </select>

          <button onClick={() => startNewGame()}>New Game</button>
        </div>

        {/* Progress bar */}

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* Sudoku Board */}

        <SudokuBoard
          board={board}
          initialBoard={initialBoard}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
        />

        {/* Error */}

        {error && <div className="error-message">{error}</div>}

        {/* Number pad */}

        <NumberPad onNumberClick={handleNumberInput} onClear={clearCell} />

        <p className="keyboard-help">
          Select a cell and use your keyboard to enter numbers.
        </p>

        {/* Win message */}

        {gameWon && (
          <div className="win-message">
            <div className="win-icon">🎉</div>

            <h2>Puzzle Complete!</h2>

            <p>Excellent work! You solved the Sudoku puzzle.</p>

            <p>
              Mistakes: <strong>{mistakes}</strong>
            </p>

            <button onClick={() => startNewGame()}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
