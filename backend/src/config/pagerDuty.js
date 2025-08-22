import { createClient } from "../utils/apiClient.js";

export const getPagerDutyClient = () => {
  const token = process.env.PAGERDUTY_API_KEY;
  const baseUrl = process.env.PAGERDUTY_BASE_URL || "https://api.pagerduty.com";

  return createClient(baseUrl, {
    Authorization: `Token token=${token}`,
    Accept: "application/vnd.pagerduty+json;version=2",
    "Content-Type": "application/json",
    From: process.env.PAGERDUTY_USER_EMAIL, // required header
  });
};
