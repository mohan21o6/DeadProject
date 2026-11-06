import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { ProjectStatus, ProjectDifficulty } from '../types';

export const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [objective, setObjective] = useState('');
  const [domain, setDomain] = useState('AI/ML');
  const [category, setCategory] = useState('Computer Vision');
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [difficulty, setDifficulty] = useState<ProjectDifficulty>('Medium');
  const [duration, setDuration] = useState('8 Weeks');
  const [teamSize, setTeamSize] = useState(3);
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [institution, setInstitution] = useState(user?.institution || 'Indian Institute of Technology');

  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(['React', 'Node.js', 'MongoDB']);

  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState<string[]>(['Authentication', 'Admin Dashboard']);

  const [githubUrl, setGithubUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');

  const handleAddTech = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter') || e.type === 'click') {
      e.preventDefault();
      if (techInput.trim() && !technologies.includes(techInput.trim())) {
        setTechnologies([...technologies, techInput.trim()]);
        setTechInput('');
      }
    }
  };

  const handleAddFeature = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter') || e.type === 'click') {
      e.preventDefault();
      if (featureInput.trim() && !features.includes(featureInput.trim())) {
        setFeatures([...features, featureInput.trim()]);
        setFeatureInput('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const newProj = createProject({
      name,
      description,
      problemStatement,
      objective,
      domain,
      category,
      status,
      difficulty,
      duration,
      teamSize,
      state,
      city,
      institution,
      technologies,
      features,
      githubUrl,
      youtubeUrl,
      liveDemoUrl
    });

    navigate(`/projects/${newProj.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="page-container space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Submit New Project</h1>
          <p className="text-sm text-slate-500 mt-1">
            Register your college or open source project into the DeadProject national registry.
          </p>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-subtle space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AI Attendance & Spoof Prevention System"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold outline-none focus:border-primary focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Primary Domain *
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-primary"
              >
                {['AI/ML', 'Web', 'Mobile', 'IoT', 'Healthcare', 'Agriculture', 'Cybersecurity', 'Blockchain', 'Robotics'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Project Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-primary"
              >
                {['Completed', 'In Progress', 'Incomplete', 'Abandoned', 'Paused'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Short Summary Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High level overview of what this project accomplishes..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm outline-none focus:border-primary focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Problem Statement
              </label>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="What real world pain point does this solve?"
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-primary focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Core Objective
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Key measurable targets or benchmark metrics..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-primary focus:bg-white"
              />
            </div>
          </div>

          {/* Institution & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. IIT Bombay"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-primary focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Indian State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-primary focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-primary focus:bg-white"
              />
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Technologies
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                placeholder="Type tech and press Enter (e.g. OpenCV, FastAPI)"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {technologies.map(t => (
                <span key={t} className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                  {t}
                  <button type="button" onClick={() => setTechnologies(technologies.filter(x => x !== t))}>
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">GitHub URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-primary focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">YouTube Demo URL</label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-primary focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Live Demo URL</label>
              <input
                type="url"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-primary focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-card transition-all"
            >
              Publish Project
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
