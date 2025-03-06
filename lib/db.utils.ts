import { supabase } from './supabase';
import { CaseDetails, HearingRow, JudgmentRow, OrderRow } from './database.types';

// SQL to create the necessary tables
export const createTablesSql = `
-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id SERIAL PRIMARY KEY,
  case_number VARCHAR(50) NOT NULL,
  case_year VARCHAR(4) NOT NULL,
  court_name VARCHAR(100) NOT NULL,
  case_type VARCHAR(50) NOT NULL,
  filing_date VARCHAR(10) NOT NULL,
  status VARCHAR(50) NOT NULL,
  plaintiff VARCHAR(100) NOT NULL,
  defendant VARCHAR(100) NOT NULL,
  judge VARCHAR(100) NOT NULL,
  next_hearing_date VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(case_number, case_year, court_name)
);

-- Hearings table
CREATE TABLE IF NOT EXISTS hearings (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  date VARCHAR(10) NOT NULL,
  time VARCHAR(10) NOT NULL,
  purpose VARCHAR(200) NOT NULL,
  courtroom VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  date VARCHAR(10) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  issued_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Judgments table
CREATE TABLE IF NOT EXISTS judgments (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  date VARCHAR(10) NOT NULL,
  type VARCHAR(50) NOT NULL,
  summary TEXT NOT NULL,
  issued_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cases_search 
  ON cases(court_name, case_type, case_number, case_year);
CREATE INDEX IF NOT EXISTS idx_hearings_case_id 
  ON hearings(case_id);
CREATE INDEX IF NOT EXISTS idx_orders_case_id 
  ON orders(case_id);
CREATE INDEX IF NOT EXISTS idx_judgments_case_id 
  ON judgments(case_id);
`;

// Initialize database with tables
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // This would typically be done through Supabase migrations 
    // or a server-side script, not from the client
    // Here's a placeholder showing the concept
    
    const { error } = await supabase.rpc('run_sql_query', { query: createTablesSql });
    
    if (error) {
      throw error;
    }
    
    console.log('Database initialized successfully');
    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { 
      success: false, 
      message: `Failed to initialize database: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

// Search for a case
export async function searchCase(params: { 
  courtName: string; 
  caseType: string; 
  caseNumber: string; 
  caseYear: string 
}): Promise<{ success: boolean; data?: CaseDetails; message?: string }> {
  try {
    // First find the case
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*')
      .eq('court_name', params.courtName)
      .eq('case_type', params.caseType)
      .eq('case_number', params.caseNumber)
      .eq('case_year', params.caseYear)
      .single();
    
    if (caseError) {
      if (caseError.code === 'PGRST116') {
        return { success: false, message: 'Case not found' };
      }
      throw caseError;
    }
    
    if (!caseData) {
      return { success: false, message: 'Case not found' };
    }
    
    // Get related hearings
    const { data: hearingsData, error: hearingsError } = await supabase
      .from('hearings')
      .select('*')
      .eq('case_id', caseData.id);
    
    if (hearingsError) throw hearingsError;
    
    // Get related orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('case_id', caseData.id);
    
    if (ordersError) throw ordersError;
    
    // Get related judgments
    const { data: judgmentsData, error: judgmentsError } = await supabase
      .from('judgments')
      .select('*')
      .eq('case_id', caseData.id);
    
    if (judgmentsError) throw judgmentsError;
    
    // Transform to the expected format
    const caseDetails: CaseDetails = {
      caseInfo: {
        id: caseData.id,
        caseNumber: caseData.case_number,
        caseYear: caseData.case_year,
        courtName: caseData.court_name,
        caseType: caseData.case_type,
        filingDate: caseData.filing_date,
        status: caseData.status,
        plaintiff: caseData.plaintiff,
        defendant: caseData.defendant,
        judge: caseData.judge
      },
      hearings: (hearingsData || []).map((hearing: HearingRow) => ({
        id: hearing.id,
        date: hearing.date,
        time: hearing.time,
        purpose: hearing.purpose,
        courtroom: hearing.courtroom,
        status: hearing.status
      })),
      orders: (ordersData || []).map((order: OrderRow) => ({
        id: order.id,
        date: order.date,
        type: order.type,
        description: order.description,
        issuedBy: order.issued_by
      })),
      judgments: (judgmentsData || []).map((judgment: JudgmentRow) => ({
        id: judgment.id,
        date: judgment.date,
        type: judgment.type,
        summary: judgment.summary,
        issuedBy: judgment.issued_by
      })),
      nextHearingDate: caseData.next_hearing_date
    };
    
    return { success: true, data: caseDetails };
  } catch (error) {
    console.error('Error searching case:', error);
    return { 
      success: false, 
      message: `Error searching for case: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

// Insert a new case with all related data
export async function insertCaseWithDetails(caseDetails: CaseDetails): Promise<{ success: boolean; caseId?: number; message?: string }> {
  // Start a transaction
  const { data, error } = await supabase.rpc('begin_transaction');
  
  try {
    // Insert case
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .insert({
        case_number: caseDetails.caseInfo.caseNumber,
        case_year: caseDetails.caseInfo.caseYear,
        court_name: caseDetails.caseInfo.courtName,
        case_type: caseDetails.caseInfo.caseType,
        filing_date: caseDetails.caseInfo.filingDate,
        status: caseDetails.caseInfo.status,
        plaintiff: caseDetails.caseInfo.plaintiff,
        defendant: caseDetails.caseInfo.defendant,
        judge: caseDetails.caseInfo.judge,
        next_hearing_date: caseDetails.nextHearingDate
      })
      .select('id')
      .single();
    
    if (caseError) throw caseError;
    
    const caseId = caseData.id;
    
    // Insert hearings
    if (caseDetails.hearings.length > 0) {
      const { error: hearingsError } = await supabase
        .from('hearings')
        .insert(caseDetails.hearings.map(h => ({
          case_id: caseId,
          date: h.date,
          time: h.time,
          purpose: h.purpose,
          courtroom: h.courtroom,
          status: h.status
        })));
      
      if (hearingsError) throw hearingsError;
    }
    
    // Insert orders
    if (caseDetails.orders.length > 0) {
      const { error: ordersError } = await supabase
        .from('orders')
        .insert(caseDetails.orders.map(o => ({
          case_id: caseId,
          date: o.date,
          type: o.type,
          description: o.description,
          issued_by: o.issuedBy
        })));
      
      if (ordersError) throw ordersError;
    }
    
    // Insert judgments
    if (caseDetails.judgments.length > 0) {
      const { error: judgmentsError } = await supabase
        .from('judgments')
        .insert(caseDetails.judgments.map(j => ({
          case_id: caseId,
          date: j.date,
          type: j.type,
          summary: j.summary,
          issued_by: j.issuedBy
        })));
      
      if (judgmentsError) throw judgmentsError;
    }
    
    // Commit transaction
    await supabase.rpc('commit_transaction');
    
    return { success: true, caseId };
  } catch (error) {
    // Rollback transaction
    await supabase.rpc('rollback_transaction');
    
    console.error('Error inserting case:', error);
    return { 
      success: false, 
      message: `Error inserting case: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

// Generate mock data for testing
export function generateMockCaseData() {
  const mockCaseDetails: CaseDetails = {
    caseInfo: {
      id: 0, // This will be assigned by the database
      caseNumber: Math.floor(1000 + Math.random() * 9000).toString(),
      caseYear: new Date().getFullYear().toString(),
      courtName: 'Northeast District Court',
      caseType: 'Civil',
      filingDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      plaintiff: 'John Doe',
      defendant: 'Jane Smith',
      judge: 'Hon. Robert Thompson'
    },
    hearings: [
      {
        id: 0,
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        purpose: 'Initial Hearing',
        courtroom: 'Court Room 302',
        status: 'Scheduled'
      }
    ],
    orders: [
      {
        id: 0,
        date: new Date().toISOString().split('T')[0],
        type: 'Temporary Restraining Order',
        description: 'Temporary restraining order issued against the defendant',
        issuedBy: 'Hon. Robert Thompson'
      }
    ],
    judgments: [],
    nextHearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };
  
  return mockCaseDetails;
}
