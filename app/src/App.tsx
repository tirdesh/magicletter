import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoutes from './routes/PublicRoutes';
import ProtectedRoutes from './routes/ProtectedRoutes';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/app/*" element={<ProtectedRoutes />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};
export default App
