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
  nextHearingDate?: string;
}
export class SearchCaseError extends Error {
    constructor(public details?: any) {
      super('Search case error occurred');
      this.name = 'SearchCaseError';
    }
  }
  export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
  }
  export interface HTTPValidationError {
    detail?: ValidationError[];
  }
  export interface APIResponse<T> {
    data?: T;
    error?: string;
    status: number;
  }
  export interface SearchResponse {
    success: boolean;
    data?: CaseDetailsResponse;
    error?: string;
  }
  export interface CaseSearchRequest {
    courtName: string;
    caseType: string;
    caseNumber: string;
    caseYear: string;
  }
  export interface DatabaseConfig {
    supabaseUrl: string;
    supabaseKey: string;
  }
  export type SearchCaseData = CaseDetailsResponse;