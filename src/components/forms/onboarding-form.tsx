"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingSchema,
  OnboardingFormData,
  SERVICE_OPTIONS,
} from "@/lib/validations/onboarding-schema";
import { ApiResponse } from "@/types/onboarding-data";
import Input from "@/components/ui/input";
import Checkbox from "@/components/ui/checkbox";
import Button from "@/components/ui/button";
import { parseServicesFromQuery } from "@/lib/utils";
import { submitOnboardingForm } from "@/lib/api/onboarding-api";

export const OnboardingForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<ApiResponse | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      services: [],
      acceptTerms: false,
    },
  });

  // Pre-fill from query params
  useEffect(() => {
    const validServices = parseServicesFromQuery();
    if (validServices.length > 0) {
      setValue("services", validServices as OnboardingFormData["services"]);
    }
  }, [setValue]);

  const onSubmit = async (data: OnboardingFormData) => {
    const formData = {
      ...data,
      projectStartDate: new Date(data.projectStartDate as unknown as string),
    };

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await submitOnboardingForm(formData);
      setSubmitResult(result);

      if (result.success) {
        reset();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch {
      setSubmitResult({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Client Onboarding Form
      </h1>

      {/* Small Success Alert */}
      {showSuccess && (
        <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm">
          Successfully submitted the onboarding form!
        </div>
      )}

      {/* Success/Error Messages */}
      {submitResult && !showSuccess && (
        <div
          className={`mb-6 p-4 rounded-md ${
            submitResult.success
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
          role="alert"
        >
          <p className="font-medium">{submitResult.message}</p>
          {submitResult.success && submitResult.data && (
            <div className="mt-3 text-sm">
              <p>
                <strong>Submitted:</strong> {submitResult.data.fullName} from{" "}
                {submitResult.data.companyName}
              </p>
              <p>
                <strong>Services:</strong>{" "}
                {submitResult.data.services.join(", ")}
              </p>
              {submitResult.data.budgetUsd && (
                <p>
                  <strong>Budget:</strong> $
                  {submitResult.data.budgetUsd.toLocaleString()}
                </p>
              )}
              <p>
                <strong>Start Date:</strong>{" "}
                {submitResult.data.projectStartDate.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <Input
          id="fullName"
          label="Full Name *"
          type="text"
          placeholder="Enter your full name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        {/* Email */}
        <Input
          id="email"
          label="Email Address *"
          type="email"
          placeholder="Enter your email address"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Company Name */}
        <Input
          id="companyName"
          label="Company Name *"
          type="text"
          placeholder="Enter your company name"
          error={errors.companyName?.message}
          {...register("companyName")}
        />

        {/* Services */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Services Interested In
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {SERVICE_OPTIONS.map((service) => (
              <Checkbox
                key={service}
                id={`services-${service.replace(/\s+/g, "-").toLowerCase()}`}
                label={service}
                value={service}
                {...register("services")}
              />
            ))}
          </div>
          {errors.services && (
            <p className="text-sm text-red-600" role="alert">
              {errors.services.message}
            </p>
          )}
        </div>

        {/* Budget */}
        <Input
          id="budgetUsd"
          label="Budget (USD)"
          type="number"
          placeholder="Enter your budget (optional)"
          min="100"
          max="1000000"
          step="1"
          error={errors.budgetUsd?.message}
          {...register("budgetUsd", { valueAsNumber: true })}
        />

        {/* Project Start Date */}
        <Input
          id="projectStartDate"
          label="Project Start Date *"
          type="date"
          min={getTodayString()}
          error={errors.projectStartDate?.message}
          {...register("projectStartDate")}
        />

        {/* Terms and Conditions */}
        <div className="mb-4">
          <div className="flex items-start">
            <Checkbox
              id="acceptTerms"
              label="I accept the terms and conditions"
              checked={watch("acceptTerms")}
              onChange={(e) => setValue("acceptTerms", e.target.checked)}
            />
          </div>
          {errors.acceptTerms && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isSubmitting}
          className="w-full"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};
