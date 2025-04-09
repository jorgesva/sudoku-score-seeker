
import React from 'react';
import { GameState, CellPosition, shouldHighlightCell } from '@/utils/gameLogic';
import { cn } from '@/lib/utils';

interface SudokuBoardProps {
  gameState: GameState;
  onCellClick: (position: CellPosition) => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ gameState, onCellClick }) => {
  const { currentGrid, originalGrid, selectedCell, errors } = gameState;
  
  // Render a single cell
  const renderCell = (row: number, col: number) => {
    const value = currentGrid[row][col];
    const isOriginal = originalGrid[row][col] !== null;
    const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
    const isHighlighted = shouldHighlightCell(row, col, selectedCell);
    const hasError = errors[`${row}-${col}`] === true;
    
    // Determine cell border styles
    const isRightSectionBorder = col === 2 || col === 5;
    const isBottomSectionBorder = row === 2 || row === 5;
    
    return (
      <div
        key={`cell-${row}-${col}`}
        className={cn(
          "sudoku-cell",
          isOriginal ? "sudoku-cell-initial" : "sudoku-cell-user",
          isSelected ? "sudoku-cell-selected" : "",
          isHighlighted && !isSelected ? "sudoku-cell-highlight" : "",
          hasError ? "sudoku-cell-error" : "",
          isRightSectionBorder ? "sudoku-section-border-right" : "",
          isBottomSectionBorder ? "sudoku-section-border-bottom" : ""
        )}
        onClick={() => onCellClick([row, col])}
      >
        {value || ""}
      </div>
    );
  };
  
  // Render a row of cells
  const renderRow = (row: number) => {
    return (
      <div key={`row-${row}`} className="grid grid-cols-9 h-full">
        {Array(9).fill(null).map((_, col) => renderCell(row, col))}
      </div>
    );
  };
  
  return (
    <div className="relative w-full max-w-md aspect-square mx-auto border-2 border-sudoku-board-border rounded bg-sudoku-board shadow-md">
      <div className="w-full h-full grid grid-rows-9">
        {Array(9).fill(null).map((_, row) => renderRow(row))}
      </div>
    </div>
  );
};

export default SudokuBoard;
