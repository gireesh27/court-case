import { z } from "zod";

// Export all declarations consistently
export const CaseSearchRequestSchema = z.object({
  courtName: z.string().describe("Name of the court"),
  caseType: z.string().describe("Type of the case"),
  caseNumber: z.string().regex(/^\d+$/, "Case number must contain only digits"),
  caseYear: z.string()
    .length(4, "Case year must be a 4-digit year")
    .refine((year) => {
      const yearNum = parseInt(year);
      const currentYear = new Date().getFullYear();
      return yearNum >= 1900 && yearNum <= currentYear;
    }, `Year must be between 1900 and current year`)
});

// Export the type
export type CaseSearchRequest = z.infer<typeof CaseSearchRequestSchema>;

// Export all other interfaces
export interface CaseInfo {
  caseNumber: string;
  caseYear: string;
  courtName: string;
  caseType: string;
  filingDate: string;
  status: string;
  plaintiff: string;
  defendant: string;
  judge: string;
}
export interface Hearing {
  date: string;
  time: string;
  purpose: string;
  courtroom: string;
  status: string;
}

export interface Order {
  date: string;
  type: string;
  description: string;
  issuedBy: string;
}

export interface Judgment {
  date: string;
  type: string;
  summary: string;
  issuedBy: string;
}

export interface CaseInfo {
  caseNumber: string;
  caseYear: string;
  courtName: string;
  caseType: string;
  filingDate: string;
  status: string;
  plaintiff: string;
  defendant: string;
  judge: string;
}

export interface CaseDetailsResponse {
  caseInfo: CaseInfo;
  hearings: Hearing[];
  orders: Order[];
  judgments: Judgment[];
  nextHearingDate?: string | null;
}
import express from 'express';
import { CaseSearchRequestSchema } from "@/types/types";

const router = express.Router();

router.post('/search', async (req, res) => {
  try {
    const request = CaseSearchRequestSchema.parse(req.body);
    
    // Mock response for demonstration
    const result: CaseDetailsResponse = {
      caseInfo: {
        caseNumber: request.caseNumber,
        caseYear: request.caseYear,
        courtName: request.courtName,
        caseType: request.caseType,
        filingDate: "2023-05-15",
        status: "Active",
        plaintiff: "John Doe",
        defendant: "XYZ Corporation",
        judge: "Hon. Robert Smith"
      },
      hearings: [
        {
          date: "2023-08-10",
          time: "10:00 AM",
          purpose: "Initial Hearing",
          courtroom: "Courtroom 3B",
          status: "Completed"
        }
      ],
      orders: [
        {
          date: "2023-08-15",
          type: "Procedural Order",
          description: "Case management timeline established",
          issuedBy: "Hon. Robert Smith"
        }
      ],
      judgments: [],
      nextHearingDate: "2024-01-15"
    };

    return res.json(result);
  } catch (error) {
    console.error("Error searching for case:", error);
    return res.status(500).json({
      error: "Failed to retrieve case information"
    });
  }
});

export default router;