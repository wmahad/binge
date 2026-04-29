import tvmazeFetch, { type Client } from "@kubb/plugin-client/clients/fetch";

export const TVMAZE_BASE_URL = "https://api.tvmaze.com" as const;

export const tvmazeClient: Client = tvmazeFetch;
