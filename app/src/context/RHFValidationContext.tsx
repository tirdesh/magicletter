import { createContext, useContext } from 'react';
import { UseFormReturn, FieldValues, FieldPath } from 'react-hook-form';

export interface RHFValidationContextProps<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>;
  validateField: (name: FieldPath<TFieldValues>, value?: any) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
}

export const RHFValidationContext = createContext<RHFValidationContextProps | undefined>(undefined);

export const useRHFValidation = <TFieldValues extends FieldValues = FieldValues>(): RHFValidationContextProps<TFieldValues> => {
  const context = useContext(RHFValidationContext);
  if (!context) {
    throw new Error('useRHFValidation must be used within a RHFValidationProvider');
  }
  return context as RHFValidationContextProps<TFieldValues>;
};
