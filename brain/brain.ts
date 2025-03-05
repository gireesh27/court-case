import {
    CaseSearchRequest,
    CheckHealthData,
    SearchCaseData,
    SearchCaseError,
    TestCaptchaSolverData,
    TestCaptchaSolverError,
    TestCaptchaSolverParams,
  } from "./data-contracts";
  import { ContentType, HttpClient, RequestParams } from "./http-client";
  
  export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
    /**
     * @description Check health of application. Returns 200 when OK, 500 when not.
     *
     * @name check_health
     * @summary Check Health
     * @request GET:/_healthz
     */
    check_health = (params: RequestParams = {}) =>
      this.request<CheckHealthData, any>({
        path: `/_healthz`,
        method: "GET",
        ...params,
      });
  
    /**
     * @description Test the CAPTCHA solver with a given URL or example CAPTCHA
     *
     * @tags court-data, captcha, dbtn/module:court_data
     * @name test_captcha_solver
     * @summary Test Captcha Solver
     * @request POST:/court-data/test-captcha
     */
    test_captcha_solver = (query: TestCaptchaSolverParams, params: RequestParams = {}) =>
      this.request<TestCaptchaSolverData, TestCaptchaSolverError>({
        path: `/court-data/test-captcha`,
        method: "POST",
        query: query,
        ...params,
      });
  
    /**
     * No description
     *
     * @tags court-data, dbtn/module:court_data
     * @name search_case
     * @summary Search Case
     * @request POST:/court-data/search
     */
    search_case = (data: CaseSearchRequest, params: RequestParams = {}) =>
      this.request<SearchCaseData, SearchCaseError>({
        path: `/court-data/search`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      });
  }