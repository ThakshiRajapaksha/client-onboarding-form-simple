import { onboardingSchema, SERVICE_OPTIONS } from "../onboarding-schema";

describe("Onboarding Schema Validation", () => {
  const validData = {
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    companyName: "Analytical Engines Ltd",
    services: ["UI/UX", "Web Dev"],
    budgetUsd: 50000,
    projectStartDate: new Date().toISOString().split("T")[0], // today
    acceptTerms: true,
  };

  describe("Full Name", () => {
    it("accepts valid full names", () => {
      expect(onboardingSchema.safeParse(validData).success).toBe(true);
    });

    it("rejects names shorter than 2 chars", () => {
      const data = { ...validData, fullName: "A" };
      expect(onboardingSchema.safeParse(data).success).toBe(false);
    });

    it("rejects names longer than 80 chars", () => {
      const data = { ...validData, fullName: "A".repeat(81) };
      expect(onboardingSchema.safeParse(data).success).toBe(false);
    });

    it("rejects invalid characters", () => {
      const data = { ...validData, fullName: "Ada123" };
      expect(onboardingSchema.safeParse(data).success).toBe(false);
    });

    it("accepts hyphens and apostrophes", () => {
      const data = { ...validData, fullName: "Ada-Lovelace O'Connor" };
      expect(onboardingSchema.safeParse(data).success).toBe(true);
    });
  });

  describe("Email", () => {
    it("accepts valid emails", () => {
      expect(onboardingSchema.safeParse(validData).success).toBe(true);
    });

    it("rejects invalid emails", () => {
      const data = { ...validData, email: "abc-email" };
      expect(onboardingSchema.safeParse(data).success).toBe(false);
    });
  });

  describe("Company Name", () => {
    it("accepts valid names", () => {
      expect(onboardingSchema.safeParse(validData).success).toBe(true);
    });

    it("rejects too short or too long names", () => {
      expect(
        onboardingSchema.safeParse({ ...validData, companyName: "A" }).success
      ).toBe(false);
      expect(
        onboardingSchema.safeParse({
          ...validData,
          companyName: "A".repeat(101),
        }).success
      ).toBe(false);
    });
  });

  describe("Services", () => {
    it("requires at least one valid service", () => {
      expect(onboardingSchema.safeParse(validData).success).toBe(true);
    });

    it("rejects empty or invalid service arrays", () => {
      const empty = { ...validData, services: [] };
      const invalid = {
        ...validData,
        services: ["Invalid Service"] as string[],
      };
      expect(onboardingSchema.safeParse(empty).success).toBe(false);
      expect(onboardingSchema.safeParse(invalid).success).toBe(false);
    });

    it("accepts all valid service combinations", () => {
      const allServices = { ...validData, services: SERVICE_OPTIONS };
      expect(onboardingSchema.safeParse(allServices).success).toBe(true);
    });
  });
  describe("Budget", () => {
    it("accepts valid budgets or undefined", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { budgetUsd: _, ...noBudget } = validData;

      // With budget
      expect(onboardingSchema.safeParse(validData).success).toBe(true);

      // Without budget
      expect(onboardingSchema.safeParse(noBudget).success).toBe(true);
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
    it("accepts today or future dates", () => {
      const today = new Date().toISOString().split("T")[0];
      const future = "2050-01-01";
      expect(
        onboardingSchema.safeParse({ ...validData, projectStartDate: today })
          .success
      ).toBe(true);
      expect(
        onboardingSchema.safeParse({ ...validData, projectStartDate: future })
          .success
      ).toBe(true);
    });

    it("rejects past or invalid dates", () => {
      const past = "2000-01-01";
      const invalid = "not-a-date";
      expect(
        onboardingSchema.safeParse({ ...validData, projectStartDate: past })
          .success
      ).toBe(false);
      expect(
        onboardingSchema.safeParse({ ...validData, projectStartDate: invalid })
          .success
      ).toBe(false);
    });
  });

  describe("Accept Terms", () => {
    it("requires acceptTerms true", () => {
      expect(onboardingSchema.safeParse(validData).success).toBe(true);
      const declined = { ...validData, acceptTerms: false };
      expect(onboardingSchema.safeParse(declined).success).toBe(false);
    });
  });

  describe("Complete Form", () => {
    it("rejects incomplete forms", () => {
      const incomplete = {
        fullName: "Ada Lovelace",
        email: "ada@example.com",
      };
      expect(onboardingSchema.safeParse(incomplete).success).toBe(false);
    });
  });
});
