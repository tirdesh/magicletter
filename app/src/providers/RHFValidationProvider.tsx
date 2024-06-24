import React from 'react';
import { useForm, UseFormProps, FieldValues, FieldPath, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFValidationContext, RHFValidationContextProps } from '../context/RHFValidationContext';
import { validationSchema } from '@/utils/validationSchema';
import * as yup from 'yup'; // Correct import

interface RHFValidationProviderProps<TFieldValues extends FieldValues = FieldValues> extends Omit<UseFormProps<TFieldValues>, 'resolver'> {
  children: React.ReactNode;
  onSubmit?: (data: TFieldValues) => void;
}

export const RHFValidationProvider = <TFieldValues extends FieldValues = FieldValues>({
    children,
    onSubmit,
    ...formProps
  }: RHFValidationProviderProps<TFieldValues>) => {
    const methods = useForm<TFieldValues>({
      ...formProps,
      resolver: yupResolver(validationSchema) as any,
    });

  const validateField = async (name: FieldPath<TFieldValues>, value?: any): Promise<boolean> => {
    try {
      if (value !== undefined) {
        await validationSchema.validateAt(name, { [name]: value });
        return true;
      } else {
        await methods.trigger(name);
        return !methods.getFieldState(name).error;
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        console.error('Validation error:', error.errors);
      } else {
        console.error('Unexpected error:', error);
      }
      return false;
    }
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      const result = await methods.trigger();
      return result;
    } catch (error) {
      console.error('Form validation error:', error);
      return false;
    }
  };

  const contextValue: RHFValidationContextProps<TFieldValues> = {
    form: methods,
    validateField,
    validateForm,
  };

  return (
    <RHFValidationContext.Provider value={contextValue as RHFValidationContextProps<FieldValues>}>
      <FormProvider {...methods}>
        {onSubmit ? (
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {children}
          </form>
        ) : (
          children
        )}
      </FormProvider>
    </RHFValidationContext.Provider>
  );
};
