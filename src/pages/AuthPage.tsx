import React, { useState } from 'react';
import { SignInForm } from '../components/SignInForm';
import { SignUpForm } from '../components/SignUpForm';
import { useNavigate } from 'react-router-dom';

export const AuthPage: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-center py-12 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">My App</h1>
          <p className="text-base-content/70">Secure authentication powered by Better Auth</p>
        </div>

        <div className="tabs tabs-boxed bg-base-100 mb-6">
          <button
            onClick={() => setIsSignIn(true)}
            className={`tab flex-1 ${isSignIn ? 'tab-active' : ''}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`tab flex-1 ${!isSignIn ? 'tab-active' : ''}`}
          >
            Sign Up
          </button>
        </div>

        {isSignIn ? (
          <SignInForm onSuccess={handleAuthSuccess} />
        ) : (
          <SignUpForm onSuccess={handleAuthSuccess} />
        )}
      </div>
    </div>
  );
};
