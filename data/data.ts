import { CaseDetailsResponse, CaseSearchRequest } from "@/types/types";

export const generateMockCaseData = (params: CaseSearchRequest): CaseDetailsResponse => {
    const nextHearingDate = new Date();
    nextHearingDate.setDate(nextHearingDate.getDate() + 30); 
    const formattedNextHearingDate = nextHearingDate.toISOString().split('T')[0];

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
            { date: "2023-02-10", time: "10:00 AM", purpose: "Initial Hearing", courtroom: "Courtroom 302", status: "Completed" },
            { date: "2023-03-05", time: "11:00 AM", purpose: "Pre-Trial Conference", courtroom: "Courtroom 304", status: "Completed" },
            { date: "2023-05-15", time: "11:30 AM", purpose: "Evidence Presentation", courtroom: "Courtroom 302", status: "Completed" },
            { date: "2023-06-20", time: "02:30 PM", purpose: "Witness Testimony", courtroom: "Courtroom 305", status: "Completed" },
            { date: "2023-08-12", time: "09:00 AM", purpose: "Cross Examination", courtroom: "Courtroom 301", status: "Completed" },
            { date: "2023-09-15", time: "01:30 PM", purpose: "Mediation", courtroom: "Courtroom 307", status: "Completed" },
            { date: "2023-11-10", time: "10:45 AM", purpose: "Final Arguments", courtroom: "Courtroom 302", status: "Scheduled" },
            { date: "2024-01-18", time: "11:00 AM", purpose: "Case Review", courtroom: "Courtroom 308", status: "Pending" },
            { date: "2024-02-22", time: "10:15 AM", purpose: "Pre-Judgment Hearing", courtroom: "Courtroom 309", status: "Pending" },
            { date: formattedNextHearingDate, time: "09:00 AM", purpose: "Final Judgment", courtroom: "Main Courtroom", status: "Scheduled" }
        ],
        orders: [
            { date: "2023-03-01", type: "Temporary Restraining Order", description: "Defendant restricted from selling disputed property", issuedBy: "Hon. Robert Thompson" },
            { date: "2023-04-15", type: "Disclosure Order", description: "Order for disclosure of financial documents", issuedBy: "Hon. Robert Thompson" },
            { date: "2023-05-25", type: "Stay Order", description: "Stay granted on earlier lower court ruling", issuedBy: "Hon. Lisa Andrews" },
            { date: "2023-07-10", type: "Contempt Notice", description: "Defendant warned for non-compliance with court orders", issuedBy: "Hon. Michael Johnson" },
            { date: "2023-08-05", type: "Evidence Submission Order", description: "Order to submit additional evidence by next hearing", issuedBy: "Hon. Emily Clarke" },
            { date: "2023-09-30", type: "Witness Summons", description: "Key witness summoned for testimony", issuedBy: "Hon. Robert Thompson" },
            { date: "2023-11-15", type: "Adjournment Order", description: "Case adjourned due to lack of evidence submission", issuedBy: "Hon. Lisa Andrews" },
            { date: "2023-12-22", type: "Court Directive", description: "Court directs parties to negotiate settlement", issuedBy: "Hon. Michael Johnson" },
            { date: "2024-01-10", type: "Final Evidence Order", description: "Last chance to submit supporting documents", issuedBy: "Hon. Emily Clarke" },
            { date: "2024-02-28", type: "Execution Order", description: "Order for execution of previous ruling", issuedBy: "Hon. Robert Thompson" }
        ],
        judgments: [
            { date: "2023-06-30", type: "Interim Judgment", summary: "Interim relief granted to plaintiff", issuedBy: "Hon. Robert Thompson" },
            { date: "2023-08-15", type: "Partial Judgment", summary: "Part of the case resolved, remaining hearings scheduled", issuedBy: "Hon. Lisa Andrews" },
            { date: "2023-09-25", type: "Dismissal", summary: "One of the claims dismissed due to lack of evidence", issuedBy: "Hon. Michael Johnson" },
            { date: "2023-10-10", type: "Settlement Judgment", summary: "Mutual settlement reached between parties", issuedBy: "Hon. Emily Clarke" },
            { date: "2023-11-05", type: "Review Judgment", summary: "Case referred to a higher court for review", issuedBy: "Hon. Robert Thompson" },
            { date: "2023-12-20", type: "Appeal Judgment", summary: "Appeal allowed on specific grounds", issuedBy: "Hon. Lisa Andrews" },
            { date: "2024-01-25", type: "Final Ruling", summary: "Court rules in favor of the plaintiff with compensation", issuedBy: "Hon. Michael Johnson" },
            { date: "2024-02-18", type: "Overturn Judgment", summary: "Previous ruling overturned due to new evidence", issuedBy: "Hon. Emily Clarke" },
            { date: "2024-03-10", type: "Contempt Judgment", summary: "Defendant penalized for disobeying court orders", issuedBy: "Hon. Robert Thompson" },
            { date: "2024-04-05", type: "Final Judgment", summary: "Defendant held liable, ordered to pay damages", issuedBy: "Hon. Lisa Andrews" }
        ],
        nextHearingDate: formattedNextHearingDate
    };
};
