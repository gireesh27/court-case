export interface CaseDetailsResponse {
  caseInfo: CaseInfo;
  hearings: Hearing[];
  orders: Order[];
  judgments: Judgment[];
  nextHearingDate?: string | null;
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

export interface CaseSearchRequest {
  courtName: string;
  caseType: string;
  caseNumber: string;
  caseYear: string;
}

export interface Hearing {
  date: string;
  time: string;
  purpose: string;
  courtroom: string;
  status: string;
}

export interface Judgment {
  date: string;
  type: string;
  summary: string;
  issuedBy: string;
}

export interface Order {
  date: string;
  type: string;
  description: string;
  issuedBy: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export type SearchCaseData = CaseDetailsResponse;
export type SearchCaseError = HTTPValidationError;