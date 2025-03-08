import axios from 'axios';
import { CaseSearchRequest, CaseDetailsResponse } from '@/types/types';
import { getSupabaseCredentials, generateMockCaseData } from "@/lib/db.utils";

export const searchCaseInDatabase = async (params: CaseSearchRequest): Promise<CaseDetailsResponse> => {
    const credentials = getSupabaseCredentials();

    if (!credentials) {
        return generateMockCaseData(params);
    }

    try {
        const { url, key } = credentials;
        const baseUrl = `${url}/rest/v1`;
        
        const headers = {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };

        const query = `court_name=eq.${params.courtName}&case_type=eq.${params.caseType}&case_number=eq.${params.caseNumber}&case_year=eq.${params.caseYear}`;
        
        const response = await axios.get(`${baseUrl}/cases?${query}`, { headers });
        
        if (!response.data || response.data.length === 0) {
            return generateMockCaseData(params);
        }

        const case_ = response.data[0];
        const caseId = case_.id;

        // Fetch related data
        const [hearings, orders, judgments] = await Promise.all([
            axios.get(`${baseUrl}/hearings?case_id=eq.${caseId}&order=date.desc`, { headers }),
            axios.get(`${baseUrl}/orders?case_id=eq.${caseId}&order=date.desc`, { headers }),
            axios.get(`${baseUrl}/judgments?case_id=eq.${caseId}&order=date.desc`, { headers })
        ]);

        return {
            caseInfo: {
                caseNumber: case_.case_number,
                caseYear: case_.case_year,
                courtName: case_.court_name,
                caseType: case_.case_type,
                filingDate: case_.filing_date,
                status: case_.status,
                plaintiff: case_.plaintiff,
                defendant: case_.defendant,
                judge: case_.judge
            },
            hearings: hearings.data || [],
            orders: orders.data || [],
            judgments: judgments.data || [],
            nextHearingDate: case_.next_hearing_date
        };
    } catch (error) {
        console.error('Error searching case in database:', error);
        return generateMockCaseData(params);
    }
};