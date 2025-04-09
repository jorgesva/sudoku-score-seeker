
import { Difficulty, calculateScore, generateSudoku, isGridComplete, isCellValid } from './sudokuGenerator';

export type SudokuGrid = (number | null)[][];
export type CellPosition = [number, number];
export type CellNotes = Record<string, number[]>;

export interface GameState {
  currentGrid: SudokuGrid;
  originalGrid: SudokuGrid;
  selectedCell: CellPosition | null;
  difficulty: Difficulty;
  startTime: number;
  endTime: number | null;
  isComplete: boolean;
  errors: Record<string, boolean>;
  notes: CellNotes;
  isNoteMode: boolean;
}

// Initialize a new game with the selected difficulty
export const initializeGame = (difficulty: Difficulty): GameState => {
  const originalGrid = generateSudoku(difficulty);
  
  return {
    currentGrid: originalGrid.map(row => [...row]),
    originalGrid,
    selectedCell: null,
    difficulty,
    startTime: Date.now(),
    endTime: null,
    isComplete: false,
    errors: {},
    notes: {},
    isNoteMode: false
  };
};

// Select a cell on the grid
export const selectCell = (state: GameState, position: CellPosition): GameState => {
  return {
    ...state,
    selectedCell: position
  };
};

// Input a number into the currently selected cell
export const inputNumber = (state: GameState, number: number): GameState => {
  if (!state.selectedCell || state.isComplete) return state;
  
  const [row, col] = state.selectedCell;
  
  // Don't allow modifying original cells
  if (state.originalGrid[row][col] !== null) return state;
  
  // Handle note mode
  if (state.isNoteMode) {
    return toggleNoteForCell(state, row, col, number);
  }
  
  // Create a deep copy of the current grid
  const newGrid = state.currentGrid.map(row => [...row]);
  
  // Update the cell
  newGrid[row][col] = number;
  
  // Clear notes for this cell
  const newNotes = { ...state.notes };
  delete newNotes[`${row}-${col}`];
  
  // Check if this new input is valid
  const valid = isCellValid(newGrid, row, col, state.originalGrid);
  
  // Update errors
  const newErrors = { ...state.errors };
  const cellKey = `${row}-${col}`;
  
  if (!valid) {
    newErrors[cellKey] = true;
  } else {
    delete newErrors[cellKey];
  }
  
  // Check if game is complete
  const complete = isGridComplete(newGrid) && Object.keys(newErrors).length === 0;
  
  return {
    ...state,
    currentGrid: newGrid,
    errors: newErrors,
    notes: newNotes,
    isComplete: complete,
    endTime: complete ? Date.now() : null
  };
};

// Toggle note mode
export const toggleNoteMode = (state: GameState): GameState => {
  return {
    ...state,
    isNoteMode: !state.isNoteMode
  };
};

// Toggle a note for a specific cell
export const toggleNoteForCell = (state: GameState, row: number, col: number, number: number): GameState => {
  if (state.currentGrid[row][col] !== null) return state;
  
  const cellKey = `${row}-${col}`;
  const currentNotes = state.notes[cellKey] || [];
  
  // Toggle the note
  const newNotes = { ...state.notes };
  if (currentNotes.includes(number)) {
    // Remove the note
    newNotes[cellKey] = currentNotes.filter(n => n !== number);
    if (newNotes[cellKey].length === 0) {
      delete newNotes[cellKey];
    }
  } else {
    // Add the note
    newNotes[cellKey] = [...currentNotes, number].sort((a, b) => a - b);
  }
  
  return {
    ...state,
    notes: newNotes
  };
};

// Clear the currently selected cell
export const clearCell = (state: GameState): GameState => {
  if (!state.selectedCell || state.isComplete) return state;
  
  const [row, col] = state.selectedCell;
  
  // Don't allow clearing original cells
  if (state.originalGrid[row][col] !== null) return state;
  
  // Create a deep copy of the current grid
  const newGrid = state.currentGrid.map(row => [...row]);
  
  // Clear the cell
  newGrid[row][col] = null;
  
  // If in note mode, also clear notes for this cell
  const newNotes = { ...state.notes };
  if (state.isNoteMode) {
    delete newNotes[`${row}-${col}`];
  }
  
  // Remove any errors for this cell
  const newErrors = { ...state.errors };
  delete newErrors[`${row}-${col}`];
  
  return {
    ...state,
    currentGrid: newGrid,
    notes: newNotes,
    errors: newErrors
  };
};

// Get game duration in seconds
export const getGameDuration = (state: GameState): number => {
  const endTime = state.endTime || Date.now();
  return Math.floor((endTime - state.startTime) / 1000);
};

// Calculate final score
export const getFinalScore = (state: GameState): number => {
  if (!state.isComplete) return 0;
  
  const duration = getGameDuration(state);
  return calculateScore(state.difficulty, duration);
};

// Format time in minutes and seconds
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Check if a cell should be highlighted
export const shouldHighlightCell = (
  row: number, 
  col: number, 
  selectedCell: CellPosition | null,
  currentGrid: SudokuGrid,
  selectedValue: number | null
): boolean => {
  if (!selectedCell) return false;
  
  const [selectedRow, selectedCol] = selectedCell;
  
  // Same row or column
  if (row === selectedRow || col === selectedCol) return true;
  
  // Same 3x3 box
  const boxRow = Math.floor(row / 3);
  const boxCol = Math.floor(col / 3);
  const selectedBoxRow = Math.floor(selectedRow / 3);
  const selectedBoxCol = Math.floor(selectedCol / 3);
  
  const sameBox = boxRow === selectedBoxRow && boxCol === selectedBoxCol;
  
  // Same number as selected cell
  const selectedCellValue = currentGrid[selectedRow][selectedCol];
  const sameNumber = selectedCellValue !== null && currentGrid[row][col] === selectedCellValue;
  
  // Matching number provided in selectedValue
  const matchesSelectedValue = selectedValue !== null && currentGrid[row][col] === selectedValue;
  
  return sameBox || sameNumber || matchesSelectedValue;
};

// Check if a note number should be highlighted
export const shouldHighlightNote = (
  noteNumber: number,
  selectedCell: CellPosition | null,
  currentGrid: SudokuGrid
): boolean => {
  if (!selectedCell) return false;
  
  const [selectedRow, selectedCol] = selectedCell;
  const selectedValue = currentGrid[selectedRow][selectedCol];
  
  return selectedValue !== null && selectedValue === noteNumber;
};

// Local storage keys
const STORAGE_KEYS = {
  CURRENT_GAME: 'sudoku-current-game',
  GAME_HISTORY: 'sudoku-game-history'
};

// Game history entry
export interface GameHistoryEntry {
  id: string;
  difficulty: Difficulty;
  startTime: number;
  endTime: number;
  duration: number;
  score: number;
}

// Save current game to local storage
export const saveGameToStorage = (state: GameState): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(state));
};

// Load current game from local storage
export const loadGameFromStorage = (): GameState | null => {
  const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
  return saved ? JSON.parse(saved) : null;
};

// Save completed game to history
export const saveGameToHistory = (state: GameState): void => {
  if (!state.isComplete || !state.endTime) return;
  
  const gameHistory = loadGameHistory();
  
  const newEntry: GameHistoryEntry = {
    id: Date.now().toString(),
    difficulty: state.difficulty,
    startTime: state.startTime,
    endTime: state.endTime,
    duration: getGameDuration(state),
    score: getFinalScore(state)
  };
  
  gameHistory.push(newEntry);
  
  // Keep only the last 50 games
  if (gameHistory.length > 50) {
    gameHistory.shift();
  }
  
  localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(gameHistory));
};

// Load game history from local storage
export const loadGameHistory = (): GameHistoryEntry[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
  return saved ? JSON.parse(saved) : [];
};

// Clear current game from storage
export const clearCurrentGame = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
};
