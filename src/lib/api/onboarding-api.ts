import { OnboardingFormData, ApiResponse } from "@/types/onboarding-data";

export async function submitOnboardingForm(
  data: unknown
): Promise<ApiResponse> {
  const endpoint = process.env.NEXT_PUBLIC_ONBOARD_URL;

  if (!endpoint) {
    throw new Error("External API endpoint is not set");
  }

  // Handle the example.com placeholder endpoint
  if (endpoint.includes("example.com")) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const formData = data as OnboardingFormData;

    return {
      success: true,
      message: "Form submitted successfully!",
      data: {
        ...formData,
        projectStartDate: new Date(formData.projectStartDate),
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
      throw new Error(`Request failed: ${res.status} ${errorText}`);
    }

    const responseData = (await res.json()) as OnboardingFormData;

    return {
      success: true,
      message: "Form submitted successfully!",
      data: {
        ...responseData,
        projectStartDate: new Date(responseData.projectStartDate),
      },
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
