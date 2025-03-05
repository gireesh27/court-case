import { API_URL } from "../constants";
import { Brain } from "./brain";

const isLocalhost = /localhost:\d{4}/i.test(window.location.origin);

const constructBaseUrl = (): string => {
  if (isLocalhost) {
    // For local development, no /routes prefix
    return window.location.origin; 
  }
  return API_URL;
};

const brain = new Brain({
  baseUrl: constructBaseUrl(),
  baseApiParams: {
    credentials: "include", // Important for sessions/authentication
  },
});

export default brain;