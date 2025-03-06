import {
  CaseSearchRequest,
  SearchCaseData,
  SearchCaseError,
} from "./data-contracts";

export class Brain {
  private readonly API_ENDPOINT = '/api/court-data';

  async searchCase(data: CaseSearchRequest): Promise<SearchCaseData> {
    const response = await fetch(this.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    return response.json();
  }
}

export const brain = new Brain();
export default brain;