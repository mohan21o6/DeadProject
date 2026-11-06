import React, { useState } from 'react';
import { 
  ShieldAlert, CheckCircle2, XCircle, Trash2, Check, 
  Users, Layers, Flag, BarChart3, Search, Eye, Database, ExternalLink, RefreshCw, Archive, GitFork, Sparkles
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const AdminPage: React.FC = () => {
  const { projects, verifyProject, deleteProject, datasetSources } = useProjects();
  const [activeTab, setActiveTab] = useState<'projects' | 'datasets' | 'reports' | 'users' | 'analytics'>('projects');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const reports = [
    { id: 'rep-1', target: 'Smart Drone Delivery', reason: 'Unverified battery claims', reporter: 'IIT Delhi Lab', status: 'Pending' },
    { id: 'rep-2', target: 'VR Classroom Review', reason: 'Spam comment with external promotional links', reporter: 'Student Admin', status: 'Pending' }
  ];

  const sourceCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of projects) {
      counts[p.source] = (counts[p.source] || 0) + 1;
    }
    return counts;
  }, [projects]);

  const adminStats = {
    totalUsers: 1420,
    totalProjects: projects.length,
    pendingReview: 0,
    reports: reports.length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 w-full">
      <div className="page-container space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>National Council Admin & Intelligence Console</span>
            </div>
            <h1 className="text-3xl font-black text-dark tracking-tight">Admin & Moderation Portal</h1>
            <p className="text-sm text-slate-500 mt-1">
              Audit external dataset pipelines, verify institution credentials, and monitor platform health.
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle">
            <span className="text-xs font-bold text-slate-500">Total Users</span>
            <p className="text-2xl font-black text-dark mt-1">{adminStats.totalUsers.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle">
            <span className="text-xs font-bold text-slate-500">Total Real Projects</span>
            <p className="text-2xl font-black text-primary mt-1">{adminStats.totalProjects.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle">
            <span className="text-xs font-bold text-amber-600">Integrated Datasets</span>
            <p className="text-2xl font-black text-amber-600 mt-1">{datasetSources.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-subtle">
            <span className="text-xs font-bold text-rose-600">Archived Repositories</span>
            <p className="text-2xl font-black text-rose-600 mt-1">{(sourceCounts['Zenodo (ESEM 2018)'] || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {['projects', 'datasets', 'reports', 'users', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-dark text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab === 'datasets' ? 'Datasets & Provenance' : tab}
            </button>
          ))}
        </div>

        {/* Datasets & Provenance Tab */}
        {activeTab === 'datasets' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-surface-border shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  <h2 className="text-base font-bold text-dark">External Dataset Ingestion & License Compliance Audit</h2>
                </div>
                <span className="text-xs text-slate-400">Total 4 Specified Sources</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {datasetSources.map(ds => {
                  const importedCount = sourceCounts[ds.name] || (ds.id === 'zenodo-1313637' ? sourceCounts['Zenodo (ESEM 2018)'] : 0);
                  const isSuccess = ds.status === 'Integrated' || ds.status === 'Active (Backend API)';

                  return (
                    <div key={ds.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-dark">{ds.name}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isSuccess ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {ds.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{ds.provider}</p>
                        </div>

                        <a
                          href={ds.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:border-primary/50 transition-colors self-start sm:self-auto"
                        >
                          <span>Dataset Portal</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ds.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                        <div>
                          <span className="font-semibold text-slate-500 block text-[11px]">License:</span>
                          <a href={ds.licenseUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold text-[11px]">
                            {ds.license}
                          </a>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-500 block text-[11px]">Records Ingested:</span>
                          <span className="font-bold text-dark text-[11px]">
                            {typeof importedCount === 'number' && importedCount > 0 ? `${importedCount.toLocaleString()} Projects` : String(ds.totalRecords)}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-500 block text-[11px]">Fields Normalized:</span>
                          <span className="text-slate-600 text-[11px] truncate block">{ds.fieldsMapped.join(', ')}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                        <span className="font-bold text-slate-700">Engineering Audit Note: </span>
                        {ds.notes}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-3xl border border-surface-border shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter repository name or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none focus:border-primary focus:bg-white"
                />
              </div>
              <span className="text-xs text-slate-400">Showing {Math.min(50, filteredProjects.length)} of {filteredProjects.length.toLocaleString()}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">License</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.slice(0, 50).map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-dark">{proj.name}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">{proj.institution}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {proj.source}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{proj.domain}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={proj.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{proj.license || 'Open'}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => verifyProject(proj.id)}
                            className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Verify project"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProject(proj.id)}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl border border-surface-border shadow-subtle p-6 space-y-4">
            <h2 className="text-base font-bold text-dark">Active Content Moderation Flags</h2>
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-dark block">{rep.target}</span>
                    <p className="text-slate-500">{rep.reason}</p>
                    <span className="text-[10px] text-slate-400">Reported by {rep.reporter}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700">
                      Dismiss
                    </button>
                    <button className="px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700">
                      Remove Target
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-3xl border border-surface-border shadow-subtle p-6 space-y-6">
            <h2 className="text-base font-bold text-dark">Platform Intelligence Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {Object.entries(sourceCounts).map(([src, count]) => (
                <div key={src} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-semibold">{src}</span>
                  <p className="text-xl font-black text-dark">{count.toLocaleString()} Projects</p>
                  <span className="text-[10px] text-primary font-bold">
                    {Math.round((count / projects.length) * 100)}% of Database
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
