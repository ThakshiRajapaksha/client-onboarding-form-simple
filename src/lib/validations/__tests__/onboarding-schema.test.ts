import { onboardingSchema, SERVICE_OPTIONS } from "../onboarding-schema";

describe("Onboarding Schema Validation", () => {
  // Use a future date to avoid any timezone/timing issues
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const futureDate = tomorrow.toISOString().split("T")[0];

  const validData = {
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    companyName: "Analytical Engines Ltd",
    services: ["UI/UX", "Web Dev"] as const,
    budgetUsd: 50000,
    projectStartDate: futureDate, // Use future date instead of today
    acceptTerms: true,
  };

  // Debug helper function
  const debugParse = (data: unknown) => {
    const result = onboardingSchema.safeParse(data);
    if (!result.success) {
      console.log("Validation errors:", result.error.issues);
    }
    return result;
  };

  describe("Full Name", () => {
    it("accepts valid full names", () => {
      const result = debugParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects names shorter than 2 chars", () => {
      const data = { ...validData, fullName: "A" };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) =>
            issue.message.includes("2 characters")
          )
        ).toBe(true);
      }
    });

    it("rejects names longer than 80 chars", () => {
      const data = { ...validData, fullName: "A".repeat(81) };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) =>
            issue.message.includes("80 characters")
          )
        ).toBe(true);
      }
    });

    it("rejects invalid characters", () => {
      const data = { ...validData, fullName: "Ada123" };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) =>
            issue.message.includes("letters, spaces")
          )
        ).toBe(true);
      }
    });

    it("accepts hyphens and apostrophes", () => {
      const data = { ...validData, fullName: "Ada-Lovelace O'Connor" };
      const result = debugParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects empty names", () => {
      const data = { ...validData, fullName: "" };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Email", () => {
    it("accepts valid emails", () => {
      const result = debugParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects invalid emails", () => {
      const data = { ...validData, email: "abc-email" };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) =>
            issue.message.includes("valid email")
          )
        ).toBe(true);
      }
    });

    it("rejects empty emails", () => {
      const data = { ...validData, email: "" };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Company Name", () => {
    it("accepts valid names", () => {
      const result = debugParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects too short names", () => {
      const data = { ...validData, companyName: "A" };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects too long names", () => {
      const data = { ...validData, companyName: "A".repeat(101) };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects empty company names", () => {
      const data = { ...validData, companyName: "" };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Services", () => {
    it("requires at least one valid service", () => {
      const result = debugParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects empty service arrays", () => {
      const data = { ...validData, services: [] };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) =>
            issue.message.includes("at least one")
          )
        ).toBe(true);
      }
    });

    it("rejects invalid services", () => {
      const data = { ...validData, services: ["Invalid Service"] as string[] };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("accepts single valid service", () => {
      const data = { ...validData, services: ["UI/UX"] as const };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts multiple valid services", () => {
      const data = {
        ...validData,
        services: ["UI/UX", "Branding", "Web Dev"] as const,
      };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts all valid service combinations", () => {
      const data = { ...validData, services: [...SERVICE_OPTIONS] };
      const result = debugParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Budget", () => {
    it("accepts valid budgets", () => {
      const data = { ...validData, budgetUsd: 50000 };
      const result = debugParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts undefined budget", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { budgetUsd, ...noBudget } = validData;
      const result = debugParse(noBudget);
      expect(result.success).toBe(true);
    });

    it("accepts NaN budget (from empty form field)", () => {
      const data = { ...validData, budgetUsd: NaN };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects invalid budgets", () => {
      const below = { ...validData, budgetUsd: 50 }; // less than min
      const above = { ...validData, budgetUsd: 1000001 }; // higher than max
      const float = { ...validData, budgetUsd: 100.5 }; // non-integer

      expect(onboardingSchema.safeParse(below).success).toBe(false);
      expect(onboardingSchema.safeParse(above).success).toBe(false);
      expect(onboardingSchema.safeParse(float).success).toBe(false);
    });
  });

  describe("Project Start Date", () => {
    it("accepts today's date", () => {
      // Use a date that's definitely today in any timezone
      const today = new Date();
      today.setDate(today.getDate()); // Ensure it's today
      const todayString =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");

      const data = { ...validData, projectStartDate: todayString };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("accepts future dates", () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const data = { ...validData, projectStartDate: tomorrow };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects past dates", () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const data = { ...validData, projectStartDate: yesterday };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) =>
            issue.message.includes("today or later")
          )
        ).toBe(true);
      }
    });

    it("rejects invalid date strings", () => {
      const data = { ...validData, projectStartDate: "not-a-date" };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects empty date strings", () => {
      const data = { ...validData, projectStartDate: "" };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("Accept Terms", () => {
    it("accepts true acceptTerms", () => {
      const data = { ...validData, acceptTerms: true };
      const result = debugParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects false acceptTerms", () => {
      const data = { ...validData, acceptTerms: false };
      const result = onboardingSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) =>
            issue.message.includes("accept the terms")
          )
        ).toBe(true);
      }
    });
  });

  describe("Complete Form Validation", () => {
    it("accepts complete valid form", () => {
      const result = debugParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects forms missing required fields", () => {
      const incomplete = {
        fullName: "Ada Lovelace",
        email: "ada@example.com",
      };
      const result = onboardingSchema.safeParse(incomplete);
      expect(result.success).toBe(false);
    });

    it("accepts form without optional budget", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { budgetUsd, ...withoutBudget } = validData;
      const result = onboardingSchema.safeParse(withoutBudget);
      expect(result.success).toBe(true);
    });
  });

  describe("SERVICE_OPTIONS Export", () => {
    it("exports correct service options", () => {
      expect(SERVICE_OPTIONS).toEqual([
        "UI/UX",
        "Branding",
        "Web Dev",
        "Mobile App",
      ]);
      expect(SERVICE_OPTIONS.length).toBe(4);
    });
  });
});
