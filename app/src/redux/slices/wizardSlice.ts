// src/redux/slices/wizardSlice.ts

import {
  CandidateInfo,
  CompanyInfo,
  GeneratedCoverLetter,
  JobSummary,
  RelevantExperience,
} from "@/model";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface WizardState {
  currentStep: number;
  jobSummary: JobSummary | null;
  companyInfo: CompanyInfo | null;
  relevantExperience: RelevantExperience | null;
  candidateInfo: CandidateInfo | null;
  generatedLetter: GeneratedCoverLetter | null;
  isInitialized: boolean;
}

const initialState: WizardState = {
  currentStep: 0,
  jobSummary: null,
  companyInfo: null,
  relevantExperience: null,
  candidateInfo: null,
  generatedLetter: null,
  isInitialized: false,
};

export const wizardSlice = createSlice({
  name: "wizard",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setJobSummary: (state, action: PayloadAction<JobSummary>) => {
      state.jobSummary = action.payload;
    },
    setCompanyInfo: (state, action: PayloadAction<CompanyInfo>) => {
      state.companyInfo = action.payload;
    },
    setRelevantExperience: (
      state,
      action: PayloadAction<RelevantExperience>
    ) => {
      state.relevantExperience = action.payload;
    },
    setCandidateInfo: (state, action: PayloadAction<CandidateInfo>) => {
      state.candidateInfo = action.payload;
    },
    setGeneratedLetter: (
      state,
      action: PayloadAction<GeneratedCoverLetter>
    ) => {
      state.generatedLetter = action.payload;
    },
    initializeWizard: (state) => {
      state.isInitialized = true;
    },
    resetWizard: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setCurrentStep,
  setJobSummary,
  setCompanyInfo,
  setRelevantExperience,
  setCandidateInfo,
  setGeneratedLetter,
  initializeWizard,
  resetWizard,
} = wizardSlice.actions;

export default wizardSlice.reducer;
