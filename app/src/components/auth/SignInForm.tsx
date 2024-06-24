import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import EmailPasswordForm from './EmailPasswordForm';
import SocialAuthButtons from './SocialAuthButtons';
import { Button } from "@/components/ui/button";

const SignInForm: React.FC = () => {
  const navigate = useNavigate();

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  return (
    <Card className="w-[350px] mx-auto my-8 shadow-lg rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription className="text-sm text-gray-500">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
      <EmailPasswordForm isSignUp={false} />
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <SocialAuthButtons />
        <Button variant="link" className="mt-2 text-blue-500" onClick={navigateToSignUp}>
          Don't have an account? Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
