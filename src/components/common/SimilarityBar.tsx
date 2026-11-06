import React from 'react';

interface SimilarityBarProps {
  percentage: number;
  showLabel?: boolean;
}

export const SimilarityBar: React.FC<SimilarityBarProps> = ({ percentage, showLabel = true }) => {
  const clamped = Math.min(Math.max(percentage, 0), 100);
  
  // Color gradient based on similarity
  const getBarColor = () => {
    if (clamped >= 80) return 'bg-gradient-to-r from-purple-500 to-indigo-600';
    if (clamped >= 60) return 'bg-gradient-to-r from-blue-500 to-purple-500';
    return 'bg-gradient-to-r from-slate-400 to-slate-500';
  };

  return (
    <div className="flex items-center gap-3 w-full">
      {showLabel && (
        <span className="text-sm font-bold text-primary min-w-[42px]">
          {clamped}%
        </span>
      )}
      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor()}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
