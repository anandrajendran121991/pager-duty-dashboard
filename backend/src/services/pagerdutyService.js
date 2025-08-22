import { getPagerDutyClient } from "../config/pagerDuty.js";

export const pagerdutyService = {
  async getIncidents() {
    const client = getPagerDutyClient();
    const res = await client.get("/incidents");
    return res.data;
  },

  async createIncident(title, description) {
    const client = getPagerDutyClient();
    const payload = {
      incident: {
        type: "incident",
        title: title,
        service: {
          id: process.env.PAGERDUTY_SERVICE_ID, // must set this in .env
          type: "service_reference",
        },
        body: {
          type: "incident_body",
          details: description,
        },
      },
    };

    const res = await client.post("/incidents", payload);
    return res.data;
  },
};

