// SignInForm.tsx
import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/app/dashboard'); // Redirect to dashboard after sign-in
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Handle successful sign-in
    } catch (error) {
      // Handle errors
      console.error('Error signing in with Google:', error);
    }
  };
  
  const navigateToSignUp = () => {
    navigate('/signup'); // Redirect to the SignUpForm component
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        className="border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2 rounded-md w-full mb-4"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        className="border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2 rounded-md w-full mb-4"
      />
      <button 
        onClick={handleSignIn} 
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Sign In
      </button>
      <button 
        onClick={handleGoogleSignIn} 
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-2"
      >
        Sign In with Google
      </button>
      <button 
        onClick={navigateToSignUp} 
        className="border border-blue-500 text-blue-500 hover:text-blue-700 hover:border-blue-700 rounded-md py-2 px-4 focus:outline-none mt-2"
      >
        Sign Up Instead
      </button>

    </div>
  );
};

export default SignInForm;
