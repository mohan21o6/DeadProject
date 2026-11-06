import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  INDIA_STATES, 
  INDIA_TECH_HUBS, 
  INDIA_HUB_CONNECTIONS, 
  INDIA_MAP_VIEWBOX,
  IndiaStatePath 
} from '../../data/indiaMapData';
import { useProjects } from '../../context/ProjectContext';
import { MapPin, Sparkles, ArrowRight } from 'lucide-react';

export const IndiaHeroNetwork: React.FC = () => {
  const { projects } = useProjects();
  const navigate = useNavigate();

  const [hoveredState, setHoveredState] = useState<IndiaStatePath | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Compute real state project counts dynamically from database records (NO invented counts)
  const stateProjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of projects) {
      if (p.state) {
        const key = p.state.trim().toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      }
    }
    return counts;
  }, [projects]);

  const getStateCount = (stateName: string): number => {
    const key = stateName.trim().toLowerCase();
    return stateProjectCounts[key] || 0;
  };

  const handleStateClick = (stateName: string) => {
    navigate(`/explore?state=${encodeURIComponent(stateName)}`);
  };

  const getHub = (id: string) => INDIA_TECH_HUBS.find(h => h.id === id);

  return (
    <div className="relative w-full max-w-[560px] h-[480px] sm:h-[520px] lg:h-[560px] flex items-center justify-center select-none">
      {/* Background ambient radial glow layers */}
      <div className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-[110px] -top-10 -right-10 pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-indigo-500/25 blur-[100px] bottom-4 left-4 pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-violet-400/15 blur-[80px] top-1/3 left-1/3 pointer-events-none" />

      {/* Floating Header Badge */}
      <div className="absolute top-2 right-2 sm:right-6 z-30 backdrop-blur-md bg-slate-900/80 border border-purple-500/30 px-3.5 py-2 rounded-2xl text-right shadow-2xl">
        <div className="flex items-center justify-end gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">PROJECTS ACROSS INDIA</span>
        </div>
        <p className="text-xs font-bold text-white tracking-wide">Interactive National Map</p>
        <p className="text-[11px] text-purple-200/80 font-medium">Click any state to explore</p>
      </div>

      {/* Interactive Tooltip Card */}
      {hoveredState && tooltipPos && (
        <div
          className="absolute z-40 pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="backdrop-blur-xl bg-slate-950/90 border border-purple-400/50 rounded-xl p-3 shadow-2xl text-left min-w-[170px] ring-1 ring-purple-500/30">
            <div className="flex items-center gap-1.5 text-purple-300 text-[11px] font-bold">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>{hoveredState.name}</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white">
                {getStateCount(hoveredState.name)}
              </span>
              <span className="text-xs text-slate-400">
                {getStateCount(hoveredState.name) === 1 ? 'project' : 'projects'} in database
              </span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-purple-300 font-semibold">
              <span>View projects</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      )}

      {/* Real Geographic Map of India SVG */}
      <svg
        viewBox={INDIA_MAP_VIEWBOX.viewBox}
        className="w-full h-full drop-shadow-[0_0_35px_rgba(139,92,246,0.35)] overflow-visible"
        onMouseLeave={() => {
          setHoveredState(null);
          setTooltipPos(null);
        }}
      >
        <defs>
          {/* Subtle state gradient */}
          <linearGradient id="stateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.85" />
          </linearGradient>

          {/* Active state hover gradient */}
          <linearGradient id="stateHoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#4338CA" stopOpacity="0.65" />
          </linearGradient>

          {/* Glowing Outline Filter */}
          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Corridor Connection Line Gradient */}
          <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
          </linearGradient>

          {/* Tech Hub Node Glow */}
          <radialGradient id="hubNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="1" />
            <stop offset="50%" stopColor="#A855F7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Base Geographical State Boundaries */}
        <g id="India_States_Group">
          {INDIA_STATES.map((state) => {
            const isHovered = hoveredState?.id === state.id;
            const projectCount = getStateCount(state.name);
            const hasProjects = projectCount > 0;

            return (
              <path
                key={state.id}
                id={state.id}
                d={state.d}
                className="transition-all duration-200 cursor-pointer outline-none"
                fill={isHovered ? "url(#stateHoverGrad)" : (hasProjects ? "rgba(30, 27, 75, 0.72)" : "rgba(15, 23, 42, 0.65)")}
                stroke={isHovered ? "#C084FC" : (hasProjects ? "rgba(168, 85, 247, 0.55)" : "rgba(139, 92, 246, 0.35)")}
                strokeWidth={isHovered ? "2.2" : (hasProjects ? "1.2" : "0.8")}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={isHovered ? "url(#purpleGlow)" : undefined}
                onMouseEnter={(e) => {
                  setHoveredState(state);
                  const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (rect) {
                    const scaleX = rect.width / INDIA_MAP_VIEWBOX.width;
                    const scaleY = rect.height / INDIA_MAP_VIEWBOX.height;
                    setTooltipPos({
                      x: state.center[0] * scaleX,
                      y: state.center[1] * scaleY
                    });
                  }
                }}
                onClick={() => handleStateClick(state.name)}
              >
                <title>{`${state.name} (${projectCount} projects)`}</title>
              </path>
            );
          })}
        </g>

        {/* 2. Innovation Corridor Connecting Lines */}
        <g id="India_Corridors_Group" className="pointer-events-none opacity-60">
          {INDIA_HUB_CONNECTIONS.map(([fromId, toId], idx) => {
            const from = getHub(fromId);
            const to = getHub(toId);
            if (!from || !to) return null;
            return (
              <line
                key={`corridor-${idx}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="url(#corridorGrad)"
                strokeWidth={idx % 3 === 0 ? "1.5" : "1.0"}
                strokeDasharray={idx % 2 === 0 ? "none" : "3 3"}
                strokeOpacity={0.65}
              />
            );
          })}
        </g>

        {/* 3. Glowing Innovation Hub Markers with Animated Activity Pulses */}
        <g id="India_TechHubs_Group" className="pointer-events-none">
          {INDIA_TECH_HUBS.map((hub) => (
            <g key={hub.id} transform={`translate(${hub.x}, ${hub.y})`}>
              {hub.pulse && (
                <circle
                  r="9"
                  fill="none"
                  stroke="#C084FC"
                  strokeWidth="1.2"
                  className="animate-ping opacity-75 origin-center"
                />
              )}
              {/* Outer halo */}
              <circle
                r="6"
                fill="url(#hubNodeGlow)"
                opacity="0.9"
              />
              {/* Center point */}
              <circle
                r="3"
                fill={hub.pulse ? "#FFFFFF" : "#E9D5FF"}
                stroke="#7C3AED"
                strokeWidth="1.2"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
