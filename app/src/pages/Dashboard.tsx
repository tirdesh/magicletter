import React from 'react';
import { auth } from '../firebase'; // Assuming you have an auth hook or context for user authentication
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const currentUser = auth.currentUser;
    const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Sign out the user using Firebase auth instance
      navigate('/signin'); // Redirect to sign-in page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <p>Hello, {currentUser?.email}</p>
      <button onClick={handleSignOut}>Sign Out</button>
      {/* Add more dashboard content or links here */}
    </div>
  );
};

export default Dashboard;
