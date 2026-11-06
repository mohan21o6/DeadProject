import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { SimilarProjectsPage } from './pages/SimilarProjectsPage';
import { FeatureComparisonPage } from './pages/FeatureComparisonPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { TeamSkillAnalysisPage } from './pages/TeamSkillAnalysisPage';
import { DeadProjectsPage } from './pages/DeadProjectsPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { IdeaCheckerPage } from './pages/IdeaCheckerPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { NationalDirectoryPage } from './pages/NationalDirectoryPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { AdminPage } from './pages/AdminPage';
import { SavedProjectsPage } from './pages/SavedProjectsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Discovery Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                <Route path="/similar-projects" element={<SimilarProjectsPage />} />
                <Route path="/compare" element={<FeatureComparisonPage />} />
                <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
                <Route path="/team-skills" element={<TeamSkillAnalysisPage />} />
                <Route path="/dead-projects" element={<DeadProjectsPage />} />
                <Route path="/idea-checker" element={<IdeaCheckerPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/national-directory" element={<NationalDirectoryPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Authenticated Workspace & Management Routes */}
                <Route path="/dashboard" element={<UserDashboardPage />} />
                <Route path="/my-projects" element={<UserDashboardPage />} />
                <Route path="/create-project" element={<CreateProjectPage />} />
                <Route path="/saved-projects" element={<SavedProjectsPage />} />
                <Route path="/admin" element={<AdminPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
