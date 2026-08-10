function SudokuCell({ value, row, col, isSelected, isOriginal, onClick }) {
  return (
    <button
      className={`
        sudoku-cell
        ${isSelected ? "selected" : ""}
        ${isOriginal ? "original" : "user-number"}
      `}
      onClick={() => onClick(row, col)}
    >
      {value !== 0 ? value : ""}
    </button>
  );
}

export default SudokuCell;
