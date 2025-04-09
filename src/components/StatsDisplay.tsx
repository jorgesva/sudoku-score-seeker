
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameHistoryEntry } from '@/utils/gameLogic';
import { Difficulty } from '@/utils/sudokuGenerator';
import { formatTime } from '@/utils/gameLogic';

interface StatsDisplayProps {
  gameHistory: GameHistoryEntry[];
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ gameHistory }) => {
  // Sort games by date (newest first)
  const sortedGames = [...gameHistory].sort((a, b) => b.endTime - a.endTime);
  
  // Calculate stats
  const totalGames = sortedGames.length;
  const bestScore = sortedGames.length > 0 
    ? Math.max(...sortedGames.map(game => game.score))
    : 0;
  
  const averageScore = sortedGames.length > 0
    ? Math.round(sortedGames.reduce((sum, game) => sum + game.score, 0) / totalGames)
    : 0;
  
  const gamesByDifficulty = sortedGames.reduce((acc, game) => {
    acc[game.difficulty] = (acc[game.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case Difficulty.Easy: return 'bg-green-100 text-green-800';
      case Difficulty.Medium: return 'bg-blue-100 text-blue-800';
      case Difficulty.Hard: return 'bg-orange-100 text-orange-800';
      case Difficulty.Expert: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalGames}</div>
              <div className="text-xs text-muted-foreground mt-1">Games Played</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{bestScore}</div>
              <div className="text-xs text-muted-foreground mt-1">Best Score</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{averageScore}</div>
              <div className="text-xs text-muted-foreground mt-1">Avg Score</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Difficulty Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(gamesByDifficulty).map(([difficulty, count]) => (
              <Badge 
                key={difficulty}
                className={getDifficultyColor(difficulty as Difficulty)}
              >
                {difficulty}: {count} game{count !== 1 ? 's' : ''}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedGames.slice(0, 5).map((game) => (
              <div key={game.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div>
                  <Badge className={getDifficultyColor(game.difficulty)}>
                    {game.difficulty}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(game.endTime)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{game.score} points</div>
                  <div className="text-xs text-muted-foreground">
                    Time: {formatTime(game.duration)}
                  </div>
                </div>
              </div>
            ))}
            
            {sortedGames.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No games played yet. Start playing to see your stats!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsDisplay;
