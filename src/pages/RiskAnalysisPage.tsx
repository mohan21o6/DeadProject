import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Layers, Sliders } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { RiskGauge } from '../components/common/RiskGauge';
import { calculateProjectRisk } from '../utils/analysisEngine';

export const RiskAnalysisPage: React.FC = () => {
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[2]?.id || 'proj-3');

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const riskAnalysis = selectedProject.riskAnalysis || calculateProjectRisk(selectedProject);

  const getRiskBadge = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Low
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="page-container space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Rule-Based Feasibility Engine</span>
            </div>
            <h1 className="text-3xl font-black text-dark tracking-tight">Project Risk Analysis</h1>
            <p className="text-sm text-slate-500 mt-1">
              Analysis based on hardware dependencies, timeline feasibility, and skill prerequisites.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-dark outline-none focus:border-primary shadow-2xs"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Risk Dashboard Card (Matching Screen 6) */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-subtle space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Semi-circle Gauge (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-slate-50/70 rounded-2xl border border-slate-100">
              <RiskGauge score={riskAnalysis.score} level={riskAnalysis.level} size={240} />
              <p className="text-xs text-slate-500 text-center mt-4 max-w-xs">
                Calculated across 5 quantitative risk dimensions for <strong>{selectedProject.name}</strong>.
              </p>
            </div>

            {/* Right Column: Factor Risk Table (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
                <span>Factor</span>
                <span className="pr-2">Risk Level</span>
              </div>

              {Object.entries(riskAnalysis.factors).map(([factorName, riskValue]) => (
                <div key={factorName} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-dark capitalize">{factorName}</span>
                    <span className="text-[11px] text-slate-400">
                      {factorName === 'complexity' ? '• Architecture & scale' :
                       factorName === 'time' ? '• Sprint duration feasibility' :
                       factorName === 'cost' ? '• Hardware & cloud budget' :
                       factorName === 'hardware' ? '• Sensor/board dependency' : '• Technical skills needed'}
                    </span>
                  </div>
                  {getRiskBadge(riskValue)}
                </div>
              ))}
            </div>

          </div>

          {/* Recommendations Banner (Matching Screen 6) */}
          <div className="p-6 rounded-2xl bg-rose-50/80 border border-rose-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-rose-700 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Key Recommendations & De-risking Actions</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-rose-950 font-medium">
              {riskAnalysis.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
