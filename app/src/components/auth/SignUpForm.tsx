// SignInForm.tsx
import React, { useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/app/dashboard'); // Redirect to dashboard after sign-in
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Handle successful sign-in
    } catch (error) {
      // Handle errors
      console.error('Error signing in with Google:', error);
    }
  };
  
  const navigateToSignIn = () => {
    navigate('/signin'); // Redirect to the SignInForm component
  };
  
  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleGoogleSignUp}>Sign up with Google</button>
      <button onClick={navigateToSignIn}>Sign In Instead</button>
    </div>
  );
};

export default SignUpForm;
