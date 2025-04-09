type SudokuGrid = (number | null)[][];

// Difficulty levels affect how many numbers are initially filled
export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
  Expert = "expert"
}

// Map difficulty to the number of cells to be filled
const difficultyMapping: Record<Difficulty, number> = {
  [Difficulty.Easy]: 45, // 45 filled cells (36 empty)
  [Difficulty.Medium]: 35, // 35 filled cells (46 empty)
  [Difficulty.Hard]: 30, // 30 filled cells (51 empty)
  [Difficulty.Expert]: 25, // 25 filled cells (56 empty)
};

// Function to check if a number can be placed at a specific position
const isValid = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let y = 0; y < 9; y++) {
    if (grid[y][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (grid[boxRow + y][boxCol + x] === num) return false;
    }
  }

  return true;
};

// Recursive function to fill the grid using backtracking
const fillGrid = (grid: SudokuGrid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        // Shuffle the numbers 1-9
        const nums = [...Array(9)].map((_, i) => i + 1).sort(() => Math.random() - 0.5);
        for (const num of nums) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = null; // Backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Create a new Sudoku puzzle
export const generateSudoku = (difficulty: Difficulty): SudokuGrid => {
  // Create an empty grid
  const grid: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(null));
  
  // Fill the grid with a valid solution
  fillGrid(grid);
  
  // Make a copy of the filled grid
  const solution = grid.map(row => [...row]);
  
  // Get number of cells to keep based on difficulty
  const cellsToKeep = difficultyMapping[difficulty];
  
  // Create a list of all 81 cell positions
  const positions = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }
  
  // Shuffle the positions
  positions.sort(() => Math.random() - 0.5);
  
  // Remove numbers to create the puzzle
  for (let i = 0; i < 81 - cellsToKeep; i++) {
    const [row, col] = positions[i];
    grid[row][col] = null;
  }
  
  return grid;
};

// Validate a complete grid
export const validateGrid = (grid: SudokuGrid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];
      if (num === null) return false;
      
      // Temporarily set the current cell to null to check if the number is valid
      grid[row][col] = null;
      const valid = isValid(grid, row, col, num);
      grid[row][col] = num;
      
      if (!valid) return false;
    }
  }
  return true;
};

// Check if a specific cell has a valid value
export const isCellValid = (
  grid: SudokuGrid, 
  row: number, 
  col: number, 
  originalGrid: SudokuGrid
): boolean => {
  const num = grid[row][col];
  if (num === null) return true;
  
  // If this is an original cell, it's always valid
  if (originalGrid[row][col] !== null) return true;
  
  // Temporarily set the current cell to null
  grid[row][col] = null;
  const valid = isValid(grid, row, col, num);
  grid[row][col] = num; // Restore the value
  
  return valid;
};

// Check if the puzzle is complete (all cells filled)
export const isGridComplete = (grid: SudokuGrid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) return false;
    }
  }
  return true;
};

// Calculate score based on difficulty and time
export const calculateScore = (difficulty: Difficulty, timeInSeconds: number): number => {
  const baseScores: Record<Difficulty, number> = {
    [Difficulty.Easy]: 1000,
    [Difficulty.Medium]: 2000,
    [Difficulty.Hard]: 3000,
    [Difficulty.Expert]: 5000,
  };
  
  // Calculate time penalty (lower time = higher score)
  const maxTime = 3600; // 1 hour max time
  const timeRatio = Math.max(0, (maxTime - timeInSeconds) / maxTime);
  
  // Calculate final score
  const finalScore = Math.round(baseScores[difficulty] * timeRatio);
  return Math.max(finalScore, 100); // Minimum score of 100
};
