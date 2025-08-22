import axios from "axios";

export const createClient = (baseURL, headers = {}) => {
  return axios.create({
    baseURL,
    headers,
    timeout: 10000, // seconds
  });
};
