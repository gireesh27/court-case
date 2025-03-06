import {
  CaseSearchRequest,
  SearchCaseData,
  SearchCaseError,
} from "./data-contracts";

export class Brain {
  static searchCase(arg0: { courtName: string; caseType: string; caseNumber: string; caseYear: string; }) {
    throw new Error("Method not implemented.");
  }
  async searchCase(data: CaseSearchRequest): Promise<SearchCaseData> {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error();
    }

    return await response.json();
  }
}

// Create and export a default instance
export const brain = new Brain();
export default brain;