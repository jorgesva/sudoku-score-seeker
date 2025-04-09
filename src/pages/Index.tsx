
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Difficulty,
} from '@/utils/sudokuGenerator';
import { 
  GameState,
  CellPosition,
  initializeGame,
  selectCell,
  inputNumber,
  clearCell,
  toggleNoteMode,
  saveGameToStorage,
  loadGameFromStorage,
  saveGameToHistory,
  clearCurrentGame,
} from '@/utils/gameLogic';
import SudokuBoard from '@/components/SudokuBoard';
import NumberSelector from '@/components/NumberSelector';
import DifficultySelector from '@/components/DifficultySelector';
import ScoreTracker from '@/components/ScoreTracker';
import { BarChart2, RotateCcw, Save } from 'lucide-react';

const Index = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Load saved game on mount
  useEffect(() => {
    const savedGame = loadGameFromStorage();
    if (savedGame) {
      // Handle older saved games without notes or isNoteMode
      if (savedGame.notes === undefined) {
        savedGame.notes = {};
      }
      if (savedGame.isNoteMode === undefined) {
        savedGame.isNoteMode = false;
      }
      setGameState(savedGame);
    } else {
      setGameState(initializeGame(Difficulty.Easy));
    }
    setIsLoading(false);
  }, []);
  
  // Save game when it changes
  useEffect(() => {
    if (gameState) {
      saveGameToStorage(gameState);
      
      // If game is complete, save to history
      if (gameState.isComplete) {
        saveGameToHistory(gameState);
        toast({
          title: "Congratulations!",
          description: "You completed the puzzle! Your score has been saved.",
        });
      }
    }
  }, [gameState, toast]);
  
  // Handle selecting a cell
  const handleCellClick = (position: CellPosition) => {
    if (!gameState) return;
    setGameState(selectCell(gameState, position));
  };
  
  // Handle number input
  const handleNumberInput = (num: number) => {
    if (!gameState || !gameState.selectedCell) return;
    setGameState(inputNumber(gameState, num));
  };
  
  // Handle clearing a cell
  const handleClearCell = () => {
    if (!gameState || !gameState.selectedCell) return;
    setGameState(clearCell(gameState));
  };
  
  // Handle toggling note mode
  const handleToggleNoteMode = () => {
    if (!gameState) return;
    setGameState(toggleNoteMode(gameState));
  };
  
  // Start a new game
  const startNewGame = (difficulty: Difficulty) => {
    if (gameState?.isComplete === false) {
      if (!window.confirm("Are you sure you want to start a new game? Your current progress will be lost.")) {
        return;
      }
    }
    
    setGameState(initializeGame(difficulty));
    toast({
      title: "New Game Started",
      description: `Difficulty: ${difficulty}`,
    });
  };
  
  // Return to current game
  const handleChangeDifficulty = (difficulty: Difficulty) => {
    startNewGame(difficulty);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500">Error loading game</p>
          <Button 
            onClick={() => setGameState(initializeGame(Difficulty.Easy))}
            className="mt-4"
          >
            Start New Game
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-4 md:py-8">
      <div className="flex flex-col items-center justify-between mb-4 md:mb-8 sm:flex-row">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 sm:mb-0">Sudoku Score Seeker</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/stats">
              <BarChart2 className="w-4 h-4 mr-2" />
              Stats
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => startNewGame(gameState.difficulty)}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>
      </div>
      
      <DifficultySelector
        selectedDifficulty={gameState.difficulty}
        onChange={handleChangeDifficulty}
        disabled={!gameState.isComplete && gameState.currentGrid.some(row => row.some(cell => cell !== null))}
      />
      
      <ScoreTracker
        startTime={gameState.startTime}
        endTime={gameState.endTime}
        isComplete={gameState.isComplete}
        difficulty={gameState.difficulty}
      />
      
      <SudokuBoard 
        gameState={gameState}
        onCellClick={handleCellClick}
      />
      
      <NumberSelector
        onSelectNumber={handleNumberInput}
        onClearCell={handleClearCell}
        onToggleNoteMode={handleToggleNoteMode}
        isNoteMode={gameState.isNoteMode}
        disabled={gameState.isComplete || !gameState.selectedCell}
      />
      
      {gameState.isNoteMode && (
        <div className="text-center text-sm text-blue-600 font-semibold mt-2">
          Note Mode Active - Tap numbers to add notes
        </div>
      )}
      
      {gameState.isComplete && (
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Puzzle Completed!</h2>
          <Button 
            onClick={() => startNewGame(gameState.difficulty)}
            className="bg-green-600 hover:bg-green-700"
          >
            Start New Game
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
