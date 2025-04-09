
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { loadGameHistory, GameHistoryEntry } from '@/utils/gameLogic';
import StatsDisplay from '@/components/StatsDisplay';
import { ChevronLeft } from 'lucide-react';

const Stats = () => {
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  
  useEffect(() => {
    const history = loadGameHistory();
    setGameHistory(history);
  }, []);
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" asChild className="mr-4">
          <Link to="/">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Game
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Your Statistics</h1>
      </div>
      
      <StatsDisplay gameHistory={gameHistory} />
      
      <div className="mt-8 text-center">
        <Button asChild>
          <Link to="/">Play Again</Link>
        </Button>
      </div>
    </div>
  );
};

export default Stats;
