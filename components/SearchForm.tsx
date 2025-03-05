import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./Button";
import { Search } from "lucide-react";
import brain from "@/brain/index";
import { CaseDetailsResponse } from "../brain/data-contracts";

// Form schema with validation rules
const searchFormSchema = z.object({
  courtName: z.string({
    required_error: "Please select a court",
  }),
  caseType: z.string({
    required_error: "Please select a case type",
  }),
  caseNumber: z.string()
    .min(1, "Case number is required")
    .regex(/^\d+$/, "Case number must contain only digits"),
  caseYear: z.string()
    .min(1, "Case year is required")
    .regex(/^\d{4}$/, "Case year must be a 4-digit year")
    .refine(
      (year) => {
        const yearNum = parseInt(year);
        const currentYear = new Date().getFullYear();
        return yearNum >= 1900 && yearNum <= currentYear;
      },
      { message: `Year must be between 1900 and ${new Date().getFullYear()}` }
    ),
});

// Define type based on the schema
type SearchFormValues = z.infer<typeof searchFormSchema>;

// Props interface
interface Props {
  onSuccess: (results: CaseDetailsResponse) => void;
  onError: (message: string) => void;
  onSubmit?: () => void; // Optional callback when form is submitted (before API call)
}

export function SearchForm({ onSuccess, onError, onSubmit }: Props) {
  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      courtName: "",
      caseType: "",
      caseNumber: "",
      caseYear: new Date().getFullYear().toString(),
    },
  });

  // Sample court names for dropdown
  const courtNames = [
    "Northeast District Court",
    "Northeast High Court",
    "Northeast Family Court",
    "Northeast Juvenile Court",
    "Northeast Special Court",
  ];

  // Sample case types for dropdown
  const caseTypes = [
    "Civil",
    "Criminal",
    "Family",
    "Probate",
    "Small Claims",
    "Traffic",
    "Juvenile",
  ];

  // Form submission handler
  const handleFormSubmit = async (data: SearchFormValues) => {
    // Notify parent component that submission has started
    if (onSubmit) {
      onSubmit();
    }
    try {
      console.log("Form submitted with data:", data);
      
      // Call the search_case API endpoint
      const response = await brain.search_case({
        courtName: data.courtName,
        caseType: data.caseType,
        caseNumber: data.caseNumber,
        caseYear: data.caseYear
      });
      
      if (response.ok) {
        // Parse the response JSON
        const caseDetails: CaseDetailsResponse = await response.json();
        console.log("Case details retrieved:", caseDetails);
        
        // Call the success callback with the results
        onSuccess(caseDetails);
        
        // Don't reset the form - keep the values so user can refine search if needed
        // reset();
      } else {
        // Handle HTTP error
        const errorData = await response.json().catch(() => ({ detail: "Unknown error occurred" }));
        const errorMessage = 'detail' in errorData ? errorData.detail : `Error ${response.status}: ${response.statusText}`;
        console.error("API error:", errorMessage);
        onError(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      onError(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Court Name Field */}
        <div className="space-y-2">
          <label htmlFor="courtName" className="block text-sm font-medium text-gray-700">
            Court Name <span className="text-red-500">*</span>
          </label>
          <select
            id="courtName"
            {...register("courtName")}
            className={`w-full px-4 py-2 border ${errors.courtName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white`}
          >
            <option value="">Select Court</option>
            {courtNames.map((court) => (
              <option key={court} value={court}>
                {court}
              </option>
            ))}
          </select>
          {errors.courtName && (
            <p className="mt-1 text-sm text-red-600">{errors.courtName.message}</p>
          )}
        </div>

        {/* Case Type Field */}
        <div className="space-y-2">
          <label htmlFor="caseType" className="block text-sm font-medium text-gray-700">
            Case Type <span className="text-red-500">*</span>
          </label>
          <select
            id="caseType"
            {...register("caseType")}
            className={`w-full px-4 py-2 border ${errors.caseType ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white`}
          >
            <option value="">Select Case Type</option>
            {caseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.caseType && (
            <p className="mt-1 text-sm text-red-600">{errors.caseType.message}</p>
          )}
        </div>

        {/* Case Number Field */}
        <div className="space-y-2">
          <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700">
            Case Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="caseNumber"
            placeholder="Enter case number"
            {...register("caseNumber")}
            className={`w-full px-4 py-2 border ${errors.caseNumber ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.caseNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.caseNumber.message}</p>
          )}
        </div>

        {/* Case Year Field */}
        <div className="space-y-2">
          <label htmlFor="caseYear" className="block text-sm font-medium text-gray-700">
            Case Year <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="caseYear"
            placeholder="YYYY"
            maxLength={4}
            {...register("caseYear")}
            className={`w-full px-4 py-2 border ${errors.caseYear ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.caseYear && (
            <p className="mt-1 text-sm text-red-600">{errors.caseYear.message}</p>
          )}
        </div>
      </div>

      {/* Form Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800 text-sm">
        <p>
          <strong>Note:</strong> All fields marked with <span className="text-red-500">*</span> are required. Our system will automatically handle CAPTCHA verification for you.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          variant="judicial"
          size="lg"
          className="w-full md:w-auto min-w-40 font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Search className="h-5 w-5" />
              Search Case
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
