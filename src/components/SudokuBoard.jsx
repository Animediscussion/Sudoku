import SudokuCell from "./SudokuCell";

function SudokuBoard({ board, initialBoard, selectedCell, onCellClick }) {
  return (
    <div className="sudoku-board">
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const isSelected =
            selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

          const isOriginal = initialBoard[rowIndex][colIndex] !== 0;

          return (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              row={rowIndex}
              col={colIndex}
              isSelected={isSelected}
              isOriginal={isOriginal}
              onClick={onCellClick}
            />
          );
        }),
      )}
    </div>
  );
}

export default SudokuBoard;
