import React from 'react';
import { ProjectStatus, RiskLevel } from '../../types';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  const getStyle = () => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60 ring-1 ring-emerald-500/20';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200/60 ring-1 ring-blue-500/20';
      case 'Incomplete':
        return 'bg-amber-50 text-amber-700 border-amber-200/60 ring-1 ring-amber-500/20';
      case 'Abandoned':
        return 'bg-rose-50 text-rose-700 border-rose-200/60 ring-1 ring-rose-500/20';
      case 'Paused':
        return 'bg-purple-50 text-purple-700 border-purple-200/60 ring-1 ring-purple-500/20';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getDotColor = () => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500';
      case 'In Progress': return 'bg-blue-500 animate-pulse';
      case 'Incomplete': return 'bg-amber-500';
      case 'Abandoned': return 'bg-rose-500';
      case 'Paused': return 'bg-purple-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs transition-colors ${sizeClasses[size]} ${getStyle()}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
      {status}
    </span>
  );
};

export const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const styles = {
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    HIGH: 'bg-rose-50 text-rose-700 border-rose-200',
    CRITICAL: 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${styles[level]}`}>
      {level} RISK
    </span>
  );
};
