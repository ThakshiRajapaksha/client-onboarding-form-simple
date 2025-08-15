# Client Onboarding Form

A simple client onboarding form built with Next.js (App Router), React Hook Form, Zod, and Tailwind CSS. The form collects client details, validates inputs, and submits data to an external API, with error handling and a clean success summary.

## Setup Steps

1. **Clone the Repository**:

```bash
git clone https://github.com/ThakshiRajapaksha/client-onboarding-form-simple.git
cd  client-onboarding-form-simple
```

2. **Install Dependencies**:

```bash
npm install
```

3. **Configure Environment Variable**:
   Create a .env.local file in the root directory and add the API endpoint:

NEXT_PUBLIC_ONBOARD_URL=https://example.com/api/onboard

You can create your own external mock url and replace it with example.com.

4.  **Run the Development Server**:

```bash
npm run dev
```

Open http://localhost:3000 in your browser to view the form.

5.  **Run Tests**:
    The project includes unit tests for the Zod schema.

```bash
npm run test
```

## React Hook Form + Zod Integration

- React Hook Form (RHF): The form uses react-hook-form for efficient management of form state and validation. The useForm hook in onboarding-form.tsx manages form state, validation errors, and submission.
  In following code snipet explain how React Hook Form + Zod Integration implemented in this code base.

'''
const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<OnboardingFormData>({
resolver: zodResolver(onboardingSchema),
defaultValues: { services: [], acceptTerms: false },
});
'''

"register" Binds form inputs to RHF.
"handleSubmit" processes submissions after validation.
"errors" provides inline error messages for each field.

- Zod: The onboarding-schema.ts file defines a Zod schema called onboardingSchema to validate form inputs.
  The schema connects with RHF using @hookform/resolvers/zod through zodResolver.
  As shown in above code ,
  Wiring was done in onboarding-form.tsx, the useForm hook uses zodResolver(onboardingSchema) to validate inputs against the schema. Validation errors show inline with errors.<field>.message.

## Environment Variable

- Variable: NEXT_PUBLIC_ONBOARD_URL

- Purpose: This defines the external API endpoint for form submissions. It is set to https://onboard.free.beeceptor.com/api/onboard for testing and development. This URL is a mock API endpoint provided by Beeceptor. It simulates server responses. This setup allows testing of the onboarding form without depending on a live production API.
  Here, example.com replaced by onboard.free.beeceptr.com

## Additional notes

- Pre-fill from Query Params: The parseServicesFromQuery in utils.ts reading the service query param, decodes it and splits into an array.
  The utilization of useEffect in onboarding-form.tsx is in setting values in the services field with valid values by the setValue.
  This fulfills the need to pre-fill through query params.

- Unit test cases: The onboarding-schema.test.ts has extensive tests of each and every field, both valid and not valid, edge cases as well as combinations.

- Additionally for testing purposes this code handles the example.com placeholder with a mock response (1-second delay). That means, The function checks if the endpoint includes example.com. If true, it simulates a successful response with a 1-second delay using setTimeout, returning a mock ApiResponse.

- Keyboard navigable key :
  Tab - Go down
  Shift+ Tab - Go Up
  Space - Select check box , date picker
  UP ARROW - Increase Budget
  DOWN ARROW - Decrease Budget
