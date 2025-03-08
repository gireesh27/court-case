import { CaseDetailsResponse, CaseSearchRequest } from "@/types/types";

export const generateMockCaseData = (params: CaseSearchRequest): CaseDetailsResponse => {
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
            },
            {
                date: "2023-05-15",
                time: "11:30 AM",
                purpose: "Evidence Presentation",
                courtroom: "Courtroom 302",
                status: "Completed"
            },
            {
                date: nextHearingDate,
                time: "09:00 AM",
                purpose: "Final Arguments",
                courtroom: "Courtroom 302",
                status: "Scheduled"
            }
        ],
        orders: [
            {
                date: "2023-03-01",
                type: "Temporary Restraining Order",
                description: "Temporary restraining order issued against the defendant",
                issuedBy: "Hon. Robert Thompson"
            },
            {
                date: "2023-04-15",
                type: "Disclosure Order",
                description: "Order for disclosure of documents related to the case",
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
};