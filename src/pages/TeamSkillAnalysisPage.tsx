import React, { useState } from 'react';
import { Users, Plus, CheckCircle2, AlertCircle, Trash2, Sparkles, UserPlus } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { calculateTeamReadiness } from '../utils/analysisEngine';
import { TeamMember } from '../types';

export const TeamSkillAnalysisPage: React.FC = () => {
  const { projects, teamMembers, addTeamMember, removeTeamMember } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'proj-1');

  // New member modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberSkills, setMemberSkills] = useState('');

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const requiredSkills = selectedProject.requiredSkills || ['Python', 'OpenCV', 'React', 'Node.js', 'MongoDB', 'Computer Vision'];

  const { overallReadiness, skillBreakdown, recommendations } = calculateTeamReadiness(
    requiredSkills,
    teamMembers
  );

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    const skillsArray = memberSkills.split(',').map(s => s.trim()).filter(Boolean);

    addTeamMember({
      name: memberName.trim(),
      role: memberRole.trim() || 'Software Engineer',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${memberName}`,
      email: `${memberName.toLowerCase().replace(/\s+/g, '.')}@deadproject.in`,
      skills: skillsArray.length > 0 ? skillsArray : ['JavaScript', 'React']
    });

    setMemberName('');
    setMemberRole('');
    setMemberSkills('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="page-container space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Team Competency Engine</span>
            </div>
            <h1 className="text-3xl font-black text-dark tracking-tight">Team Skill Analysis</h1>
            <p className="text-sm text-slate-500 mt-1">
              Check if your team has the required technical stack for <span className="font-semibold text-primary">"{selectedProject.name}"</span>
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

        {/* Main Content (Matching Screen 9 Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Required Skills Breakdown (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-dark">Required Skills Coverage</h2>
              <span className="text-xs font-medium text-slate-400">{requiredSkills.length} Core Requirements</span>
            </div>

            {/* Skills List with Progress Bars */}
            <div className="space-y-4">
              {skillBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-dark text-sm">{item.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold ${item.status === 'Missing' ? 'text-rose-500' : 'text-slate-500'}`}>
                        {item.status === 'Missing' ? 'Missing / Gap' : item.members.join(', ')}
                      </span>
                      <span className="text-primary font-bold min-w-[32px] text-right">{item.coverage}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        item.status === 'Missing' ? 'bg-rose-400' : 'bg-primary'
                      }`}
                      style={{ width: `${item.coverage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Team Readiness Banner (Matching Screen 9) */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-extrabold text-emerald-900">
                  Team Readiness: {overallReadiness}%
                </p>
                <p className="text-xs text-emerald-800">
                  {overallReadiness >= 75
                    ? 'Your team has most of the required skills to execute this project successfully.'
                    : 'Your team has significant technical gaps. Consider adding specialists.'}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-1 text-xs text-slate-600 pt-2">
              <p className="font-bold text-dark uppercase tracking-wider text-[10px]">Action Items:</p>
              {recommendations.map((rec, i) => (
                <p key={i}>• {rec}</p>
              ))}
            </div>
          </div>

          {/* Right Column: Your Team Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-dark">Your Team ({teamMembers.length})</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>

              {/* Members List (Matching Screen 9 cards) */}
              <div className="space-y-3">
                {teamMembers.map(member => (
                  <div key={member.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white" />
                      <div>
                        <p className="text-xs font-bold text-dark">{member.name}</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {member.skills.map((s, i) => (
                            <span key={i} className="text-[10px] font-medium text-slate-600 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeTeamMember(member.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary text-slate-600 hover:text-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-dark">Add Team Member</h3>
            <form onSubmit={handleAddMemberSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Member Name</label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Anand Varma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Role</label>
                <input
                  type="text"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  placeholder="e.g. ML Engineer / Backend Lead"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-primary focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={memberSkills}
                  onChange={(e) => setMemberSkills(e.target.value)}
                  placeholder="e.g. Python, OpenCV, TensorFlow, C++"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary-hover shadow-xs"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
