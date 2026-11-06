import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Menu, X, PlusCircle, Bookmark, 
  Sparkles, Layers, Skull, BarChart3, Users, ShieldAlert,
  ChevronDown, LogOut, LayoutDashboard, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const { selectedComparisonIds } = useProjects();
  const location = useLocation();
  const navigate = useNavigate();

  // Close drawers on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsNotificationsOpen(false);
    setShowSearchModal(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Idea Checker', path: '/idea-checker', highlight: true },
    { name: 'Dead Projects', path: '/dead-projects' },
    { name: 'Resources', path: '/resources' },
    { name: 'About', path: '/about' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(quickSearchQuery.trim())}`);
      setShowSearchModal(false);
      setQuickSearchQuery('');
    }
  };

  const notifications = [
    { id: 'n1', title: 'New Similar Project Found', desc: 'AI Attendance System matched with 3 new projects.', time: '10m ago' },
    { id: 'n2', title: 'Review Received', desc: 'Arjun left a 4-star review on your project.', time: '1h ago' },
    { id: 'n3', title: 'National Hackathon Alert', desc: 'Smart India Hackathon submissions are open.', time: '1d ago' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-border transition-all w-full">
      <div className="nav-container">
        <div className="flex items-center justify-between h-18 py-2">
          
          {/* 1. Left: Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group mr-4 lg:mr-8 xl:mr-10 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-accent to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                <span className="tracking-tighter">D</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-dark">
                DeadProject
              </span>
            </Link>
          </div>

          {/* 2. Center: Desktop Navigation Links (Spacious, comfortable padding & clear labels) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-semibold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'text-primary bg-primary-light font-bold shadow-2xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-slate-100/70'
                  }`}
                >
                  {link.name}
                  {link.highlight && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-primary text-white tracking-wider">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right: Search, Comparison, Notifications, Auth Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0">
            
            {/* Quick Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-medium transition-colors border border-slate-200/70"
              title="Search projects (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden xl:inline text-xs">Search projects, stack...</span>
              <kbd className="hidden 2xl:inline text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">
                Ctrl K
              </kbd>
            </button>

            {/* Comparison Pill (if active) */}
            {selectedComparisonIds.length > 0 && (
              <Link
                to="/compare"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-100 text-primary text-xs font-bold hover:bg-purple-200 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Compare ({selectedComparisonIds.length})</span>
              </Link>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-dark hover:bg-slate-100 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-surface-border p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <span className="text-sm font-bold text-dark">Notifications</span>
                    <span className="text-xs text-primary font-medium cursor-pointer">Mark all as read</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-semibold text-dark">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 pl-2.5 pr-2 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/50"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-dark truncate max-w-[120px]">{user.name}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-surface-border p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-dark">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <p className="text-[10px] text-primary font-medium mt-0.5">{user.institution}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-primary rounded-xl"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>

                    <Link
                      to="/my-projects"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-primary rounded-xl"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      My Projects
                    </Link>

                    <Link
                      to="/create-project"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-primary rounded-xl"
                    >
                      <PlusCircle className="w-4 h-4 text-slate-400" />
                      Create Project
                    </Link>

                    <Link
                      to="/saved-projects"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-primary rounded-xl"
                    >
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      Saved Projects
                    </Link>

                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-primary rounded-xl"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                      Admin Portal
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-primary hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-all hover:shadow-card"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-18 bg-white border-b border-slate-200 shadow-2xl p-6 z-50 animate-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
          <div className="space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-slate-800 hover:bg-purple-50 hover:text-primary transition-colors"
              >
                <span>{link.name}</span>
                {link.highlight && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary text-white">
                    AI
                  </span>
                )}
              </Link>
            ))}
            
            <div className="border-t border-slate-100 pt-3 mt-2 space-y-1">
              <Link
                to="/similar-projects"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                Similar Projects Matrix
              </Link>
              <Link
                to="/compare"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                Feature Comparison ({selectedComparisonIds.length})
              </Link>
              <Link
                to="/national-directory"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                National College Directory
              </Link>
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Admin Console
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal Overlay */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <form onSubmit={handleSearchSubmit} className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-primary" />
              <input
                type="text"
                value={quickSearchQuery}
                onChange={(e) => setQuickSearchQuery(e.target.value)}
                placeholder="Search projects by title, acronym, tech stack (e.g. RTC, APSRTC, VTC, AI, Python)..."
                className="w-full bg-transparent text-base outline-none font-medium placeholder:text-slate-400"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            <div className="p-4 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
              <span>Press <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border">Enter</kbd> to search all projects</span>
              <span className="font-semibold text-primary">Over 1,160+ verified intelligence records</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
