import React, { useState, useEffect } from 'react';
import { useRHFValidation } from '@/context/RHFValidationContext';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormData {
  email: string;
}

const DummyValidationComponent: React.FC = () => {
  const { validateField } = useRHFValidation<FormData>();
  const [email, setEmail] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (email) {
        const isValid = await validateField('email', email);
        setValidationMessage(isValid ? 'Email is valid' : 'Email is invalid');
      } else {
        setValidationMessage('');
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(debounceTimer);
  }, [email, validateField]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={email}
          onChange={handleEmailChange}
          type="email"
          placeholder="Enter your email"
        />
      </div>
      {validationMessage && (
        <span className={validationMessage.includes('valid') ? 'text-red-500' : 'text-green-500'}>
          {validationMessage}
        </span>
      )}
    </div>
  );
};

export default DummyValidationComponent;
