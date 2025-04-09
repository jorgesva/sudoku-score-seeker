
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberSelectorProps {
  onSelectNumber: (num: number) => void;
  onClearCell: () => void;
  onToggleNoteMode: () => void;
  isNoteMode: boolean;
  disabled?: boolean;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({ 
  onSelectNumber, 
  onClearCell,
  onToggleNoteMode,
  isNoteMode,
  disabled = false 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto mt-4">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
        <Button
          key={`num-${num}`}
          variant="outline"
          className={cn(
            "w-10 h-10 md:w-12 md:h-12 text-xl font-semibold",
            isNoteMode && "bg-blue-50"
          )}
          onClick={() => onSelectNumber(num)}
          disabled={disabled}
        >
          {num}
        </Button>
      ))}
      <Button
        variant="outline"
        className={cn(
          "w-10 h-10 md:w-12 md:h-12 text-xl text-destructive",
          isNoteMode && "bg-blue-50"
        )}
        onClick={onClearCell}
        disabled={disabled}
      >
        <Trash2 size={20} />
      </Button>
      <Button
        variant="outline"
        className={cn(
          "w-10 h-10 md:w-12 md:h-12 text-xl",
          isNoteMode ? "bg-primary text-white" : ""
        )}
        onClick={onToggleNoteMode}
        disabled={disabled}
      >
        <Pencil size={20} />
      </Button>
    </div>
  );
};

export default NumberSelector;
