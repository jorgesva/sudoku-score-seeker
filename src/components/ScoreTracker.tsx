
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Trophy } from 'lucide-react';
import { formatTime, getGameDuration, getFinalScore } from '@/utils/gameLogic';

interface ScoreTrackerProps {
  startTime: number;
  endTime: number | null;
  isComplete: boolean;
  difficulty: string;
}

const ScoreTracker: React.FC<ScoreTrackerProps> = ({ 
  startTime, 
  endTime, 
  isComplete,
  difficulty 
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  
  // Update current time
  useEffect(() => {
    // If game is complete, calculate final time and score
    if (isComplete && endTime) {
      const finalDuration = Math.floor((endTime - startTime) / 1000);
      setCurrentTime(finalDuration);
      
      // Calculate score based on difficulty and time
      const gameState = {
        difficulty: difficulty as any,
        startTime,
        endTime,
        isComplete
      };
      setScore(getFinalScore(gameState as any));
      return;
    }
    
    // Update time every second if game is not complete
    const timer = setInterval(() => {
      setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime, endTime, isComplete, difficulty]);
  
  return (
    <div className="grid grid-cols-2 gap-2 max-w-md mx-auto my-4">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span className="font-medium">Time</span>
          </div>
          <span className="font-mono text-lg">{formatTime(currentTime)}</span>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={18} />
            <span className="font-medium">Score</span>
          </div>
          <span className="font-mono text-lg">{isComplete ? score : "-"}</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreTracker;
