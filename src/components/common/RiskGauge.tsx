import React from 'react';
import { RiskLevel } from '../../types';

interface RiskGaugeProps {
  score: number; // 0 to 100
  level: RiskLevel;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, size = 180 }) => {
  // Arc calculation for semi-circle gauge
  const radius = 70;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  // Score 0 to 100 maps to strokeDashoffset
  const progress = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getColor = () => {
    if (score >= 70) return '#EF4444'; // Danger
    if (score >= 45) return '#F59E0B'; // Warning
    return '#10B981'; // Success
  };

  const getBgColor = () => {
    if (score >= 70) return 'text-red-500';
    if (score >= 45) return 'text-amber-500';
    return 'text-emerald-500';
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg
        width={size}
        height={size * 0.65}
        viewBox="0 0 180 110"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <path
          d="M 20 95 A 70 70 0 0 1 160 95"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress Arc */}
        <path
          d="M 20 95 A 70 70 0 0 1 160 95"
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Score Overlay */}
      <div className="absolute bottom-1 flex flex-col items-center">
        <div className="flex items-baseline">
          <span className="text-3xl font-extrabold text-[#111827] tracking-tight">{score}</span>
          <span className="text-sm font-semibold text-slate-400">/100</span>
        </div>
        <span className={`text-xs font-bold tracking-wider uppercase mt-0.5 ${getBgColor()}`}>
          {level} RISK
        </span>
      </div>
    </div>
  );
};
