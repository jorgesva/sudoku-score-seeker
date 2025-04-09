
import React from 'react';
import { Button } from '@/components/ui/button';
import { Difficulty } from '@/utils/sudokuGenerator';
import { cn } from '@/lib/utils';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onChange,
  disabled = false
}) => {
  const difficulties = [
    { value: Difficulty.Easy, label: 'Easy', color: 'bg-green-100 text-green-800' },
    { value: Difficulty.Medium, label: 'Medium', color: 'bg-blue-100 text-blue-800' },
    { value: Difficulty.Hard, label: 'Hard', color: 'bg-orange-100 text-orange-800' },
    { value: Difficulty.Expert, label: 'Expert', color: 'bg-red-100 text-red-800' }
  ];
  
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto mb-4">
      {difficulties.map((difficulty) => (
        <Button
          key={difficulty.value}
          variant="outline"
          className={cn(
            "font-medium",
            selectedDifficulty === difficulty.value ? difficulty.color : ""
          )}
          onClick={() => onChange(difficulty.value)}
          disabled={disabled}
        >
          {difficulty.label}
        </Button>
      ))}
    </div>
  );
};

export default DifficultySelector;
