
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface NumberSelectorProps {
  onSelectNumber: (num: number) => void;
  onClearCell: () => void;
  disabled?: boolean;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({ 
  onSelectNumber, 
  onClearCell,
  disabled = false 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto mt-4">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
        <Button
          key={`num-${num}`}
          variant="outline"
          className="w-12 h-12 text-xl font-semibold"
          onClick={() => onSelectNumber(num)}
          disabled={disabled}
        >
          {num}
        </Button>
      ))}
      <Button
        variant="outline"
        className="w-12 h-12 text-xl text-destructive"
        onClick={onClearCell}
        disabled={disabled}
      >
        <Trash2 size={20} />
      </Button>
    </div>
  );
};

export default NumberSelector;
