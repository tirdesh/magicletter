import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useValidation } from "../../hooks/useValidation";

interface EmailPasswordFormProps {
  isSignUp?: boolean;
}

interface FormData {
  email: string;
  password: string;
}

const EmailPasswordForm: React.FC<EmailPasswordFormProps> = ({
  isSignUp = false,
}) => {
  const navigate = useNavigate();
  const { validateField } = useValidation();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);
    setFormErrors({ email: emailError, password: passwordError });
    return !emailError && !passwordError;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const { email, password } = formData;

      try {
        if (isSignUp) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
        navigate("/app/dashboard");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          {formErrors.email && (
            <span className="text-red-500">{formErrors.email}</span>
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
          {formErrors.password && (
            <span className="text-red-500">{formErrors.password}</span>
          )}
        </div>
      </div>
      <Button className="w-full mt-6" type="submit">
        {isSignUp ? "Sign Up" : "Sign In"}
      </Button>
    </form>
  );
};

export default EmailPasswordForm;
