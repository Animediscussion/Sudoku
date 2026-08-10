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

  // ---------------------------------------------
  // Start a new game
  // ---------------------------------------------

  const startNewGame = (level = difficulty) => {
    const { puzzle, solution: generatedSolution } = generateSudoku(level);

    setBoard(puzzle);

    setInitialBoard(puzzle.map((row) => [...row]));

    setSolution(generatedSolution);

    setSelectedCell(null);
    setError("");
  };

  // ---------------------------------------------
  // Generate first puzzle
  // ---------------------------------------------

  useEffect(() => {
    startNewGame("medium");
  }, []);

  // ---------------------------------------------
  // Cell click
  // ---------------------------------------------

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
    setError("");
  };

  // ---------------------------------------------
  // Number input
  // ---------------------------------------------

  const handleNumberInput = (number) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    // Don't modify original cells
    if (initialBoard[row][col] !== 0) {
      return;
    }

    // Sudoku rule validation
    if (!isValidMove(board, row, col, number)) {
      setError(`${number} cannot be placed here`);

      return;
    }

    const newBoard = board.map((currentRow) => [...currentRow]);

    newBoard[row][col] = number;

    setBoard(newBoard);
    setError("");
  };

  // ---------------------------------------------
  // Clear selected cell
  // ---------------------------------------------

  const clearCell = () => {
    if (!selectedCell) return;

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
  }, [selectedCell, board, initialBoard]);

  // ---------------------------------------------
  // Difficulty change
  // ---------------------------------------------

  const handleDifficultyChange = (event) => {
    const level = event.target.value;

    setDifficulty(level);

    startNewGame(level);
  };

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
      <h1>Sudoku</h1>

      {/* Difficulty */}

      <div className="game-controls">
        <label>Difficulty:</label>

        <select value={difficulty} onChange={handleDifficultyChange}>
          <option value="easy">Easy</option>

          <option value="medium">Medium</option>

          <option value="hard">Hard</option>
        </select>

        <button onClick={() => startNewGame()}>New Game</button>
      </div>

      {/* Sudoku */}

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
    </div>
  );
}

export default App;
