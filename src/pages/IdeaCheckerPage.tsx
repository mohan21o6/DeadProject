import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, 
  Lightbulb, Layers, Plus, X, Search, ShieldCheck 
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { IdeaCheckResult } from '../types';
import { RiskGauge } from '../components/common/RiskGauge';
import { SimilarityBar } from '../components/common/SimilarityBar';
import { StatusBadge } from '../components/common/StatusBadge';

export const IdeaCheckerPage: React.FC = () => {
  const { checkIdea, createProjectFromIdea } = useProjects();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState('AI Based Plant Disease Detection');
  const [description, setDescription] = useState('Smartphone camera leaf scanner that detects fungal and bacterial plant diseases in crops using deep convolutional neural networks with localized fertilizer advice.');
  const [domain, setDomain] = useState('Agriculture');
  
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(['Python', 'PyTorch', 'React Native', 'FastAPI', 'YOLOv8']);
  
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'Camera leaf scanner',
    'Offline disease classification',
    'Vernacular audio advisory',
    'Fertilizer dosage calculator'
  ]);

  const [analysisResult, setAnalysisResult] = useState<IdeaCheckResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAddTech = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter') || e.type === 'click') {
      e.preventDefault();
      if (techInput.trim() && !technologies.includes(techInput.trim())) {
        setTechnologies([...technologies, techInput.trim()]);
        setTechInput('');
      }
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
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

  const handleRemoveFeature = (feat: string) => {
    setFeatures(features.filter(f => f !== feat));
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = checkIdea({
        name: projectName,
        description,
        technologies,
        features,
        domain
      });
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 400);
  };

  const handleStartProject = () => {
    if (!analysisResult) return;
    const newProj = createProjectFromIdea(analysisResult, {
      name: projectName,
      description,
      technologies,
      features,
      domain
    });
    navigate(`/projects/${newProj.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="page-container space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Idea Intelligence & Differentiation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-dark tracking-tight">
            Check My Project Idea
          </h1>
          <p className="text-sm text-slate-500">
            Verify whether your project idea already exists in Indian colleges, identify missing innovation features, and calculate execution risk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-surface-border p-6 shadow-subtle space-y-5">
            <h2 className="text-base font-bold text-dark border-b border-slate-100 pb-3">
              Enter Project Concept
            </h2>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. AI Attendance Tracker"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-dark outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Domain
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-dark outline-none focus:border-primary"
                >
                  {['AI/ML', 'Web', 'Mobile', 'IoT', 'Healthcare', 'Agriculture', 'Cybersecurity', 'Blockchain', 'Robotics'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Description & Problem Solved
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what your system does and how users interact with it..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-dark outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>

              {/* Technologies Input */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Technologies (Press Enter)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                    placeholder="e.g. OpenCV, Node.js"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {technologies.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg bg-purple-50 text-primary border border-purple-100">
                      {t}
                      <button type="button" onClick={() => handleRemoveTech(t)} className="text-purple-400 hover:text-purple-700">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Planned Features Input */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Key Planned Features (Press Enter)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={handleAddFeature}
                    placeholder="e.g. Real-time push alert"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {features.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                      {f}
                      <button type="button" onClick={() => handleRemoveFeature(f)} className="text-slate-400 hover:text-slate-700">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-card transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? 'Analyzing Across 342+ Projects...' : 'Analyze Idea'}</span>
              </button>
            </form>
          </div>

          {/* Right Analysis Results (7 cols) - Matching Section 11 specifications */}
          <div className="lg:col-span-7 space-y-6">
            {analysisResult ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Top Metrics Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-subtle">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Similarity to Existing Projects</span>
                    <p className="text-2xl font-black text-primary mt-1">{analysisResult.similarityScore}% Match</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {analysisResult.similarityScore >= 70
                        ? 'High similarity detected. Strong differentiation recommended.'
                        : 'Moderate uniqueness. Good candidate for MVP development.'}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-subtle flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Score</span>
                      <p className="text-2xl font-black text-dark mt-1">{analysisResult.riskScore} / 100</p>
                      <span className={`text-xs font-bold uppercase ${
                        analysisResult.riskLevel === 'HIGH' ? 'text-rose-600' : 'text-amber-600'
                      }`}>
                        {analysisResult.riskLevel} RISK
                      </span>
                    </div>
                    <RiskGauge score={analysisResult.riskScore} level={analysisResult.riskLevel} size={110} />
                  </div>
                </div>

                {/* Similar Existing Projects Found List */}
                <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle space-y-3">
                  <h3 className="text-sm font-bold text-dark uppercase tracking-wider">
                    Existing Similar Projects in National Database
                  </h3>
                  <div className="space-y-2.5">
                    {analysisResult.similarProjects.map(sp => (
                      <div key={sp.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                        <div>
                          <Link to={`/projects/${sp.id}`} className="font-bold text-dark text-xs sm:text-sm hover:text-primary">
                            {sp.name}
                          </Link>
                          <span className="text-[10px] text-slate-400 block">{sp.domain}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-primary">{sp.similarity}% match</span>
                          <StatusBadge status={sp.status} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Gaps & Recommendations (Matching Section 11 Example) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-subtle space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Existing Common Features
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {analysisResult.existingCommonFeatures.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-subtle space-y-2 bg-purple-50/40">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Less Common / Missing Features
                    </h4>
                    <ul className="space-y-1 text-xs text-purple-900 font-semibold">
                      {analysisResult.rareOrMissingFeatures.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-primary font-bold">+</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Strategic Differentiation Recommendation Box */}
                <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-900 uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-indigo-600" />
                    <span>Innovation Strategy Recommendation</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-indigo-950 font-medium">
                    {analysisResult.recommendations.map((rec, i) => (
                      <li key={i}>• {rec}</li>
                    ))}
                  </ul>
                </div>

                {/* "Start My Project" One-Click Workspace Button */}
                <div className="p-6 rounded-2xl bg-dark text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                  <div>
                    <h3 className="text-base font-bold text-white">Satisfied with the architecture?</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Initialize a new project workspace with agile Kanban tasks and team allocation.</p>
                  </div>
                  <button
                    onClick={handleStartProject}
                    className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all whitespace-nowrap flex items-center gap-2"
                  >
                    <span>Start My Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-surface-border p-12 text-center space-y-4 shadow-subtle">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-primary mx-auto flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-dark">Ready to Analyze Your Idea</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Fill in the project concept details on the left and click <strong>"Analyze Idea"</strong>. We will run Jaccard text overlap, technology stack intersection, and feature opportunity analysis against our national database.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
