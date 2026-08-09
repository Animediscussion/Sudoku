import { useState } from "react";
import "./App.css";

const initialBoard = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],

  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],

  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [selectedCell, setSelectedCell] = useState(null);

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    // Don't allow changing original puzzle numbers
    if (initialBoard[row][col] !== 0) return;

    const newBoard = board.map((currentRow) => [...currentRow]);

    newBoard[row][col] = number;

    setBoard(newBoard);
  };

  const clearCell = () => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    if (initialBoard[row][col] !== 0) return;

    const newBoard = board.map((currentRow) => [...currentRow]);

    newBoard[row][col] = 0;

    setBoard(newBoard);
  };

  return (
    <div className="app">
      <h1>Sudoku</h1>

      <div className="sudoku-board">
        {board.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isSelected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

            const isOriginal = initialBoard[rowIndex][colIndex] !== 0;

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`
                  sudoku-cell
                  ${isSelected ? "selected" : ""}
                  ${isOriginal ? "original" : "user-number"}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {value !== 0 ? value : ""}
              </button>
            );
          }),
        )}
      </div>

      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <button key={number} onClick={() => handleNumberInput(number)}>
            {number}
          </button>
        ))}

        <button onClick={clearCell}>⌫</button>
      </div>
    </div>
  );
}

export default App;
