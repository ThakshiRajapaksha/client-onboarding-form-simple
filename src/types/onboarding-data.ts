export interface OnboardingFormData {
  fullName: string;
  email: string;
  companyName: string;
  services: string[];
  budgetUsd?: number;
  projectStartDate: Date;
  acceptTerms: boolean;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: OnboardingFormData;
}
