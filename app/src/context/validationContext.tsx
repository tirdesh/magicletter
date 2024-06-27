// ValidationContext.tsx

import React, { createContext, ReactNode } from "react";
import * as Yup from "yup";

// Define validation schema types
interface ValidationSchema {
  [key: string]: Yup.StringSchema | Yup.NumberSchema | Yup.BooleanSchema;
}

// Define context interface
export interface ValidationContextProps {
  validateField: (fieldName: keyof ValidationSchema, value: string) => string;
}

// Create context
export const ValidationContext = createContext<
  ValidationContextProps | undefined
>(undefined);

// Validation schema definitions
const validationSchema: ValidationSchema = {
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^(\+\d{1,3})?\d{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  username: Yup.string()
    .matches(/^[a-zA-Z0-9_-]+$/, "Invalid username")
    .required("Username is required"),
  date: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .required("Date is required"),
  positiveInteger: Yup.number()
    .positive("Value must be a positive integer")
    .integer("Value must be an integer")
    .required("Value is required"),
  url: Yup.string().url("Invalid URL").required("URL is required"),
  age: Yup.number()
    .min(0, "Age must be a positive number")
    .max(120, "Age must be less than or equal to 120")
    .required("Age is required"),
  zipCode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, "Invalid zip code")
    .required("Zip code is required"),
  creditCardNumber: Yup.string()
    .matches(/^\d{16}$/, "Invalid credit card number")
    .required("Credit card number is required"),
  terms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("Terms and conditions are required"),
};

// Provider component
export const ValidationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const validateField = (
    fieldName: keyof ValidationSchema,
    value: string
  ): string => {
    const schema = validationSchema[fieldName];
    if (!schema) {
      return "";
    }

    try {
      schema.validateSync(value);
      return "";
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return error.message;
      }
      return "Validation error";
    }
  };

  const contextValue: ValidationContextProps = {
    validateField,
  };

  return (
    <ValidationContext.Provider value={contextValue}>
      {children}
    </ValidationContext.Provider>
  );
};
