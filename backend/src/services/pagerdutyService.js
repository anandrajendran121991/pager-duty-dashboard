import axios from "axios";
import { getPagerDutyClient } from "../config/pagerDuty.js";
import crypto from "crypto"; // ES Module

// In-memory cache for idempotency keys
const idempotencyCache = new Map();

export const pagerdutyService = {
  async getIncidents() {
    const client = getPagerDutyClient();
    const res = await client.get("/incidents");
    return res.data;
  },

  async createIncident(
    title,
    description,
    maxRetries = 3,
    timeoutMs = 5000,
    baseDelayMs = 100
  ) {
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

    function getIdempotencyKey(title, description) {
      const key = `${title}:${description}`;
      if (idempotencyCache.has(key)) {
        return idempotencyCache.get(key);
      }
      const newKey = crypto.randomUUID();
      idempotencyCache.set(key, newKey);

      // Optional: Auto-expire after 1 hour
      setTimeout(() => idempotencyCache.delete(key), 3600 * 1000);

      return newKey;
    }

    const idempotencyKey = getIdempotencyKey(title, description);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        const res = await client.post("/incidents", payload, {
          headers: { "X-Request-Id": idempotencyKey },
          signal: controller.signal,
        });
        clearTimeout(timeout);
        return res.data;
      } catch (err) {
        // If error is not retryable (e.g., 4xx except 429), break immediately
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          if (status && status < 500 && status !== 429) {
            throw new Error(
              `❌ Non-retryable error: ${status} - ${err.message}`
            );
          }
        }

        if (attempt === maxRetries) {
          throw new Error(
            `❌ Failed after ${maxRetries} attempts: ${err.message}`
          );
        }

        const delay = baseDelayMs * Math.pow(2, attempt - 1); // 100, 200, 400...
        console.warn(
          `⚠️ ${err.message} - Retrying in ${delay}ms (attempt ${attempt})`
        );
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  },
};
