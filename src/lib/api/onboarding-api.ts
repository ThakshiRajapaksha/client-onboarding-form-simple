import { ApiResponse, OnboardingFormData } from "@/types/onboarding-data";

// Map HTTP status codes with user understandable messages
const getErrorMessage = (status: number, errorText: string): string => {
  try {
    // Attempt to parse JSON error response
    const errorData = JSON.parse(errorText);
    const errorMessage = errorData.error || errorData.message || errorText;
    switch (status) {
      case 400:
        return `Invalid form data submitted. ${
          errorMessage
            ? `Details: ${errorMessage}`
            : "Please check your inputs and try again."
        }`;
      case 401:
        return `Authentication failed. ${
          errorMessage
            ? `Details: ${errorMessage}`
            : "Please try again or contact support."
        }`;
      case 403:
        return `Access denied. ${
          errorMessage
            ? `Details: ${errorMessage}`
            : "You don't have permission to submit this form."
        }`;
      case 429:
        return `Too many requests. Please try again later.`;
      case 500:
        return `Server error. Please try again later or contact support.`;
      default:
        return `An error occurred: ${errorMessage || "Please try again."}`;
    }
  } catch {
    // Fallback if response is not JSON type
    switch (status) {
      case 400:
        return "Invalid form data submitted. Please check your inputs and try again.";
      case 401:
        return "Authentication failed. Please try again or contact support.";
      case 403:
        return "Access denied. You don't have permission to submit this form.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later or contact support.";
      default:
        return `An unexpected error occurred: ${
          errorText || "Please try again."
        }`;
    }
  }
};

export async function submitOnboardingForm(
  data: unknown
): Promise<ApiResponse> {
  const endpoint = process.env.NEXT_PUBLIC_ONBOARD_URL;

  if (!endpoint) {
    return {
      success: false,
      message: "External API endpoint is not set",
    };
  }

  // Handle the example.com placeholder endpoint
  if (endpoint.includes("example.com")) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const formData = data as OnboardingFormData;
    const { budgetUsd, ...restFormData } = formData;
    return {
      success: true,
      message: "Form submitted successfully!",
      data: {
        ...restFormData,
        projectStartDate: new Date(formData.projectStartDate),
        ...(typeof budgetUsd === "number" && !isNaN(budgetUsd)
          ? { budgetUsd }
          : {}),
      },
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(getErrorMessage(res.status, errorText));
    }

    return {
      success: true,
      message: "Form submitted successfully!",
    };
  } catch (err) {
    console.error("Onboarding form submission failed:", err);
    return {
      success: false,
      message:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}
