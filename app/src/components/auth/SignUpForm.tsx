import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import EmailPasswordForm from './EmailPasswordForm';
import SocialAuthButtons from './SocialAuthButtons';
import { Button } from "@/components/ui/button";

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();

  const navigateToSignIn = () => {
    navigate('/signin');
  };

  return (
    <Card className="w-[350px] mx-auto my-8 shadow-lg rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription className="text-sm text-gray-500">Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
      <EmailPasswordForm isSignUp={true} />
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <SocialAuthButtons />
        <Button variant="link" className="mt-2 text-blue-500" onClick={navigateToSignIn}>
          Already have an account? Sign In
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
