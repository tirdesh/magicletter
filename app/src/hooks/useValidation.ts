// src/hooks/useValidation.ts
import { useContext } from "react";
import {
  ValidationContext,
  ValidationContextProps,
} from "../context/validationContext";

export const useValidation = (): ValidationContextProps => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error("useValidation must be used within a ValidationProvider");
  }
  return context;
};
