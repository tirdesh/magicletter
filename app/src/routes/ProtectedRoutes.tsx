import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import Dashboard from '../pages/Dashboard';

const ProtectedRoutes: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false); // Once user state is set, loading is complete
    });

    return () => unsubscribe();
  }, []);

  // While loading, show a spinner or loading message
  if (loading) {
    return <div>Loading...</div>; // Replace with your spinner component if needed
  }

  // After loading, redirect if no user is authenticated
  if (!user) {
    return <Navigate to="/" />;
  }

  // Render protected routes once user is authenticated
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default ProtectedRoutes;
