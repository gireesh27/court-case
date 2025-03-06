export interface SupabaseCredentials {
  url: string;
  key: string;
}

export interface DatabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
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

export interface CaseSearchRequest {
  courtName: string;
  caseType: string;
  caseNumber: string;
  caseYear: string;
}
import { DatabaseConfig, CaseSearchRequest, CaseDetailsResponse } from '@/types/types';
import axios from 'axios';

export class DatabaseService {
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      apikey: this.config.supabaseKey,
      Authorization: `Bearer ${this.config.supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    };
  }

  async searchCaseInDatabase(params: CaseSearchRequest): Promise<CaseDetailsResponse> {
    try {
      const url = `${this.config.supabaseUrl}/rest/v1/cases`;
      const query = `court_name=eq.${params.courtName}&case_type=eq.${params.caseType}&case_number=eq.${params.caseNumber}&case_year=eq.${params.caseYear}`;

      const response = await axios.get(`${url}?${query}`, { headers: this.getHeaders() });
      
      if (!response.data?.length) {
        return this.generateMockCaseData(params);
      }

      const case_data = response.data[0];
      const case_id = case_data.id;

      // Fetch related data
      const [hearings, orders, judgments] = await Promise.all([
        this.fetchHearings(case_id),
        this.fetchOrders(case_id),
        this.fetchJudgments(case_id)
      ]);

      return {
        caseInfo: {
          caseNumber: case_data.case_number,
          caseYear: case_data.case_year,
          courtName: case_data.court_name,
          caseType: case_data.case_type,
          filingDate: case_data.filing_date,
          status: case_data.status,
          plaintiff: case_data.plaintiff,
          defendant: case_data.defendant,
          judge: case_data.judge
        },
        hearings,
        orders,
        judgments,
        nextHearingDate: case_data.next_hearing_date
      };
    } catch (error) {
      console.error('Database search error:', error);
      return this.generateMockCaseData(params);
    }
  }

  private generateMockCaseData(params: CaseSearchRequest): CaseDetailsResponse {
    const nextHearingDate = new Date().toISOString().split('T')[0];

    return {
      caseInfo: {
        caseNumber: params.caseNumber,
        caseYear: params.caseYear,
        courtName: params.courtName,
        caseType: params.caseType,
        filingDate: "2023-01-15",
        status: "Active",
        plaintiff: "John Doe",
        defendant: "Jane Smith",
        judge: "Hon. Robert Thompson"
      },
      hearings: [
        {
          date: "2023-02-10",
          time: "10:00 AM",
          purpose: "Initial Hearing",
          courtroom: "Courtroom 302",
          status: "Completed"
        }
      ],
      orders: [
        {
          date: "2023-03-01",
          type: "Temporary Restraining Order",
          description: "Temporary restraining order issued against the defendant",
          issuedBy: "Hon. Robert Thompson"
        }
      ],
      judgments: [
        {
          date: "2023-06-30",
          type: "Interim Judgment",
          summary: "Interim judgment regarding property dispute",
          issuedBy: "Hon. Robert Thompson"
        }
      ],
      nextHearingDate
    };
  }

  private async fetchHearings(caseId: string): Promise<Hearing[]> {
    const url = `${this.config.supabaseUrl}/rest/v1/hearings?case_id=eq.${caseId}&order=date.desc`;
    const response = await axios.get(url, { headers: this.getHeaders() });
    return response.data || [];
  }

  private async fetchOrders(caseId: string): Promise<Order[]> {
    const url = `${this.config.supabaseUrl}/rest/v1/orders?case_id=eq.${caseId}&order=date.desc`;
    const response = await axios.get(url, { headers: this.getHeaders() });
    return response.data || [];
  }

  private async fetchJudgments(caseId: string): Promise<Judgment[]> {
    const url = `${this.config.supabaseUrl}/rest/v1/judgments?case_id=eq.${caseId}&order=date.desc`;
    const response = await axios.get(url, { headers: this.getHeaders() });
    return response.data || [];
  }
}
import express from 'express';
import { DatabaseService } from '../services/database';
import { CaseSearchRequest } from '@/types/types';

const router = express.Router();
const dbService = new DatabaseService({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_KEY!
});

router.post('/search_case', async (req, res) => {
  try {
    const request: CaseSearchRequest = req.body;
    const caseDetails = await dbService.searchCaseInDatabase(request);
    res.json(caseDetails);
  } catch (error) {
    console.error('Search case error:', error);
    res.status(500).json({ error: 'Failed to retrieve case information' });
  }
});

export default router;