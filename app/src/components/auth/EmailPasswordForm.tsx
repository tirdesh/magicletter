import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useRHFValidation } from '@/context/RHFValidationContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailPasswordFormProps {
  isSignUp?: boolean;
}

interface FormData {
  email: string;
  password: string;
}

const EmailPasswordForm: React.FC<EmailPasswordFormProps> = ({ isSignUp = false }) => {
  const navigate = useNavigate();
  const { form, validateForm } = useRHFValidation<FormData>();
  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: FormData) => {
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    const { email, password } = data;

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getErrorMessage = (fieldName: keyof FormData): string => {
    const error = errors[fieldName];
    if (error) {
      return typeof error === 'string' ? error : error.message || '';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register('email')}
            type="email"
            placeholder="Enter your email"
          />
          {errors.email && <span className="text-red-500">{getErrorMessage('email')}</span>}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            {...register('password')}
            type="password"
            placeholder="Enter your password"
          />
          {errors.password && <span className="text-red-500">{getErrorMessage('password')}</span>}
        </div>
      </div>
      <Button className="w-full mt-6" onClick={handleSubmit(onSubmit)}>{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
    </div>
  );
};

export default EmailPasswordForm;
