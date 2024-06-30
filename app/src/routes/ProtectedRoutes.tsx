import { useAuth } from "@/hooks/useAuth";
import CoverLetterWizard from "@/pages/CoverLetterWizard";
import ResumeDashboard from "@/pages/ResumeDashboard";
import ResumeViewPage from "@/pages/ResumeViewPage";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

const ProtectedRoutes: React.FC = () => {
  const { currentUser } = useAuth();

  // If no user is authenticated, redirect to the login page
  if (currentUser === null) {
    return <Navigate to="/" />;
  }

  // Render protected routes once user is authenticated
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/magic-wizard" element={<CoverLetterWizard />} />
      <Route path="/resumes" element={<ResumeDashboard />} />
      <Route path="/resume/:id" element={<ResumeViewPage />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default ProtectedRoutes;
