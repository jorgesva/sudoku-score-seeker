
import React from 'react';
import { GameState, CellPosition, shouldHighlightCell, shouldHighlightNote } from '@/utils/gameLogic';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SudokuBoardProps {
  gameState: GameState;
  onCellClick: (position: CellPosition) => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ gameState, onCellClick }) => {
  const { currentGrid, originalGrid, selectedCell, errors, notes, isNoteMode } = gameState;
  const isMobile = useIsMobile();
  
  // Get the value of the selected cell (to use for highlighting)
  const selectedValue = selectedCell ? currentGrid[selectedCell[0]][selectedCell[1]] : null;
  
  // Render notes for a cell
  const renderNotes = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    const cellNotes = notes[cellKey] || [];
    
    if (cellNotes.length === 0) return null;
    
    return (
      <div className="grid grid-cols-3 grid-rows-3 h-full w-full absolute top-0 left-0">
        {Array.from({ length: 9 }, (_, i) => i + 1).map(num => {
          const isNotePresent = cellNotes.includes(num);
          const isHighlighted = isNotePresent && shouldHighlightNote(num, selectedCell, currentGrid);
          
          return (
            <div key={`note-${row}-${col}-${num}`} className="flex items-center justify-center">
              {isNotePresent && (
                <span className={cn(
                  "text-[8px] md:text-[10px] text-gray-600",
                  isHighlighted && "font-extrabold text-primary"
                )}>
                  {num}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render a single cell
  const renderCell = (row: number, col: number) => {
    const value = currentGrid[row][col];
    const isOriginal = originalGrid[row][col] !== null;
    const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
    const isHighlighted = shouldHighlightCell(row, col, selectedCell, currentGrid, selectedValue);
    const hasError = errors[`${row}-${col}`] === true;
    const hasNotes = notes[`${row}-${col}`]?.length > 0;
    
    // Determine cell border styles
    const isRightSectionBorder = col === 2 || col === 5;
    const isBottomSectionBorder = row === 2 || row === 5;
    
    return (
      <div
        key={`cell-${row}-${col}`}
        className={cn(
          "sudoku-cell relative",
          isOriginal ? "sudoku-cell-initial" : "sudoku-cell-user",
          isSelected ? "sudoku-cell-selected" : "",
          isHighlighted && !isSelected ? "sudoku-cell-highlight" : "",
          hasError ? "sudoku-cell-error" : "",
          isRightSectionBorder ? "sudoku-section-border-right" : "",
          isBottomSectionBorder ? "sudoku-section-border-bottom" : "",
          isNoteMode && "border-blue-300",
          isMobile ? "text-xl" : "text-2xl"
        )}
        onClick={() => onCellClick([row, col])}
      >
        {value || ""}
        {!value && hasNotes && renderNotes(row, col)}
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
