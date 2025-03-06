/** CaseDetailsResponse */
export interface CaseDetailsResponse {
    caseInfo: CaseInfo;
    /** Hearings */
    hearings: Hearing[];
    /** Orders */
    orders: Order[];
    /** Judgments */
    judgments: Judgment[];
    /** Nexthearingdate */
    nextHearingDate?: string | null;
  }
  
  /** CaseInfo */
  export interface CaseInfo {
    /** Casenumber */
    caseNumber: string;
    /** Caseyear */
    caseYear: string;
    /** Courtname */
    courtName: string;
    /** Casetype */
    caseType: string;
    /** Filingdate */
    filingDate: string;
    /** Status */
    status: string;
    /** Plaintiff */
    plaintiff: string;
    /** Defendant */
    defendant: string;
    /** Judge */
    judge: string;
  }
  
  /** CaseSearchRequest */
  export interface CaseSearchRequest {
    /**
     * Courtname
     * Name of the court
     */
    courtName: string;
    /**
     * Casetype
     * Type of the case
     */
    caseType: string;
    /**
     * Casenumber
     * Case number
     */
    caseNumber: string;
    /**
     * Caseyear
     * Year of the case
     */
    caseYear: string;
  }
  
  /** HTTPValidationError */
  export interface HTTPValidationError {
    /** Detail */
    detail?: ValidationError[];
  }
  
  
  /** Hearing */
  export interface Hearing {
    /** Date */
    date: string;
    /** Time */
    time: string;
    /** Purpose */
    purpose: string;
    /** Courtroom */
    courtroom: string;
    /** Status */
    status: string;
  }
  
  /** Judgment */
  export interface Judgment {
    /** Date */
    date: string;
    /** Type */
    type: string;
    /** Summary */
    summary: string;
    /** Issuedby */
    issuedBy: string;
  }
  
  /** Order */
  export interface Order {
    /** Date */
    date: string;
    /** Type */
    type: string;
    /** Description */
    description: string;
    /** Issuedby */
    issuedBy: string;
  }
  
  /** ValidationError */
  export interface ValidationError {
    /** Location */
    loc: (string | number)[];
    /** Message */
    msg: string;
    /** Error Type */
    type: string;
  }
  
  export type SearchCaseData = CaseDetailsResponse;
  
  export type SearchCaseError = HTTPValidationError;