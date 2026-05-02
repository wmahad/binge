import { setupWorker } from "msw/browser";
import { handlers } from "../generated/msw/msw";

export const mswWorker = setupWorker(...handlers);
