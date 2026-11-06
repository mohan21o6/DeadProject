import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Minus, Sparkles, Plus, Trash2, Layers } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { generateFeatureMatrix } from '../utils/analysisEngine';

export const FeatureComparisonPage: React.FC = () => {
  const { projects, selectedComparisonIds, toggleCompareProject, clearComparison } = useProjects();
  
  // Choose selected or fallback to first 4 projects
  const comparedProjects = projects.filter(p => selectedComparisonIds.includes(p.id)).length >= 2
    ? projects.filter(p => selectedComparisonIds.includes(p.id)).slice(0, 4)
    : projects.slice(0, 4);

  const featureMatrix = generateFeatureMatrix(comparedProjects);

  const renderIcon = (status: 'AVAILABLE' | 'NOT_AVAILABLE' | 'PARTIAL') => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        );
      case 'PARTIAL':
        return (
          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xs font-black">
            ◐
          </div>
        );
      case 'NOT_AVAILABLE':
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <X className="w-4 h-4 stroke-[3]" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 w-full">
      <div className="page-container space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-primary text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Project Differentiation Matrix</span>
            </div>
            <h1 className="text-3xl font-black text-dark tracking-tight">Feature Comparison</h1>
            <p className="text-sm text-slate-500 mt-1">
              Compare architectural features, APIs, and innovation opportunities across candidate projects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearComparison}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl"
            >
              Reset Selection
            </button>
            <Link
              to="/explore"
              className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add From Explorer</span>
            </Link>
          </div>
        </div>

        {/* Comparison Matrix Card (Matching Screen 5) */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-subtle overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs">
                  <th className="p-4 text-left font-extrabold text-slate-700 min-w-[200px]">
                    Feature / Capability
                  </th>
                  {comparedProjects.map((p, idx) => (
                    <th key={p.id} className="p-4 font-extrabold text-dark min-w-[170px]">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                          Project {String.fromCharCode(65 + idx)}
                        </span>
                        <Link
                          to={`/projects/${p.id}`}
                          className="text-xs sm:text-sm font-bold text-dark hover:text-primary transition-colors line-clamp-1"
                        >
                          {p.name}
                        </Link>
                        <span className="text-[10px] text-slate-400 font-normal">{p.domain}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {featureMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 text-left">
                      <p className="font-bold text-dark text-sm">{row.feature}</p>
                      <p className="text-[11px] text-slate-400">{row.description}</p>
                    </td>

                    {comparedProjects.map(p => (
                      <td key={p.id} className="p-4">
                        {renderIcon(row.availability[p.id] || 'NOT_AVAILABLE')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Feature Opportunity Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                Innovation Opportunity
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Real-time Alerting & Push Notifications</strong> appears in only 1 of the compared projects. Implementing this feature will give your project a strong differentiator in evaluations.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                Baseline Requirements Met
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                All compared projects successfully implement <strong>Authentication & Admin Dashboards</strong>. Ensure you build these core essentials first before tackling advanced features.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
