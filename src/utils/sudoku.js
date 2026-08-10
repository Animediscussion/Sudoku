export const isValidMove = (board, row, col, number) => {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === number) {
      return false;
    }
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === number) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === number) {
        return false;
      }
    }
  }

  return true;
};

// --------------------------------------------------
// Create empty 9x9 board
// --------------------------------------------------

const createEmptyBoard = () => {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
};

// --------------------------------------------------
// Shuffle array
// --------------------------------------------------

const shuffle = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

// --------------------------------------------------
// Generate complete Sudoku solution
// --------------------------------------------------

const solveSudoku = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (const number of numbers) {
          if (isValidMove(board, row, col, number)) {
            board[row][col] = number;

            if (solveSudoku(board)) {
              return true;
            }

            board[row][col] = 0;
          }
        }

        return false;
      }
    }
  }

  return true;
};

// --------------------------------------------------
// Difficulty settings
// --------------------------------------------------

const difficultySettings = {
  easy: 40,
  medium: 50,
  hard: 58,
};

// --------------------------------------------------
// Generate puzzle
// --------------------------------------------------

export const generateSudoku = (difficulty = "medium") => {
  const solution = createEmptyBoard();

  solveSudoku(solution);

  const puzzle = solution.map((row) => [...row]);

  const cellsToRemove = difficultySettings[difficulty];

  let removed = 0;

  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }

  return {
    puzzle,
    solution,
  };
};
