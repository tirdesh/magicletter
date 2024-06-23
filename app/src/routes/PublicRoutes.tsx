// PublicRoutes.tsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignIn from '../components/auth/SignInForm';
import SignUp from '../components/auth/SignUpForm';

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default PublicRoutes;
