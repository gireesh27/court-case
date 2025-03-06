export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cases: {
        Row: CaseRow
        Insert: Omit<CaseRow, 'id' | 'created_at'>
        Update: Partial<Omit<CaseRow, 'id'>>
      }
      hearings: {
        Row: HearingRow
        Insert: Omit<HearingRow, 'id' | 'created_at'>
        Update: Partial<Omit<HearingRow, 'id'>>
      }
      orders: {
        Row: OrderRow
        Insert: Omit<OrderRow, 'id' | 'created_at'>
        Update: Partial<Omit<OrderRow, 'id'>>
      }
      judgments: {
        Row: JudgmentRow
        Insert: Omit<JudgmentRow, 'id' | 'created_at'>
        Update: Partial<Omit<JudgmentRow, 'id'>>
      }
    }
  }
}

// Case information table
export interface CaseRow {
  id: number
  case_number: string
  case_year: string
  court_name: string
  case_type: string
  filing_date: string
  status: string
  plaintiff: string
  defendant: string
  judge: string
  created_at: string
  updated_at?: string
  next_hearing_date?: string
}

// Hearings table
export interface HearingRow {
  id: number
  case_id: number
  date: string
  time: string
  purpose: string
  courtroom: string
  status: string
  created_at: string
  updated_at?: string
}

// Orders table
export interface OrderRow {
  id: number
  case_id: number
  date: string
  type: string
  description: string
  issued_by: string
  created_at: string
  updated_at?: string
}

// Judgments table
export interface JudgmentRow {
  id: number
  case_id: number
  date: string
  type: string
  summary: string
  issued_by: string
  created_at: string
  updated_at?: string
}

// Helper model for frontend
export interface CaseDetails {
  caseInfo: {
    id: number
    caseNumber: string
    caseYear: string
    courtName: string
    caseType: string
    filingDate: string
    status: string
    plaintiff: string
    defendant: string
    judge: string
  }
  hearings: {
    id: number
    date: string
    time: string
    purpose: string
    courtroom: string
    status: string
  }[]
  orders: {
    id: number
    date: string
    type: string
    description: string
    issuedBy: string
  }[]
  judgments: {
    id: number
    date: string
    type: string
    summary: string
    issuedBy: string
  }[]
  nextHearingDate?: string
}
