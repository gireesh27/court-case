// Sample data for testing purposes

export const sampleCaseDetails = {
    caseInfo: {
      caseNumber: "12345",
      caseYear: "2023",
      courtName: "Northeast District Court",
      caseType: "Civil",
      filingDate: "2023-05-15",
      status: "Active",
      plaintiff: "John Doe",
      defendant: "XYZ Corporation",
      judge: "Hon. Robert Smith",
    },
    hearings: [
      {
        id: "h1",
        date: "2023-08-10",
        time: "10:00 AM",
        purpose: "Initial Hearing",
        courtroom: "Courtroom 3B",
        status: "Completed",
      },
      {
        id: "h2",
        date: "2023-10-22",
        time: "11:30 AM",
        purpose: "Evidence Submission",
        courtroom: "Courtroom 2A",
        status: "Completed",
      },
      {
        id: "h3",
        date: "2024-01-15",
        time: "09:30 AM",
        purpose: "Witness Testimony",
        courtroom: "Courtroom 5C",
        status: "Completed",
      },
      {
        id: "h4",
        date: "2025-04-15",
        time: "10:30 AM",
        purpose: "Final Arguments",
        courtroom: "Courtroom 1A",
        status: "Scheduled",
      },
    ],
    orders: [
      {
        id: "o1",
        date: "2023-08-15",
        type: "Procedural Order",
        description: "Case management timeline established",
        issuedBy: "Hon. Robert Smith",
      },
      {
        id: "o2",
        date: "2023-11-02",
        type: "Interim Order",
        description: "Temporary injunction granted",
        issuedBy: "Hon. Robert Smith",
      },
      {
        id: "o3",
        date: "2024-01-20",
        type: "Disclosure Order",
        description: "Defendant ordered to submit additional documentation",
        issuedBy: "Hon. Robert Smith",
      },
    ],
    judgments: [],
    nextHearingDate: "2025-04-15",
  };
  