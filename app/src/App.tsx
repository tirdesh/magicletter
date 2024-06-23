import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoutes from './routes/PublicRoutes';
import ProtectedRoutes from './routes/ProtectedRoutes';
import { ThemeProvider } from './providers/ThemeProvider';
import { Layout } from './components/Layout/Layout';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/*" element={<PublicRoutes />} />
            <Route path="/app/*" element={<ProtectedRoutes />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};
export default App
