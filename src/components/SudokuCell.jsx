function SudokuCell({
  value,
  row,
  col,
  isSelected,
  isOriginal,
  selectedValue,
  onClick,
}) {
  const sameNumber = value !== 0 && selectedValue === value;

  return (
    <button
      className={`
        sudoku-cell
        ${isSelected ? "selected" : ""}
        ${sameNumber ? "same-number" : ""}
        ${isOriginal ? "original" : "user-number"}
      `}
      onClick={() => onClick(row, col)}
    >
      {value !== 0 ? value : ""}
    </button>
  );
}

export default SudokuCell;
