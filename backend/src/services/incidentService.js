import { pagerdutyService } from "./pagerdutyService.js";
// Later we can import other services like DatadogService, etc.
export const IncidentService = {
  async getIncidents(provider = "pagerduty") {
    if (provider === "pagerduty") {
      return pagerdutyService.getIncidents();
    }
    // if (provider === "datadog") return DatadogService.getIncidents();
    throw new Error(`Unknown provider: ${provider}`);
  },
  async createIncident({ title, description }, provider = "pagerduty") {
    if (provider === "pagerduty") {
      return pagerdutyService.createIncident(title, description);
    }
    // if (provider === "datadog") return DatadogService.createIncident(title, description);
    throw new Error(`Unknown provider: ${provider}`);
  },
};
