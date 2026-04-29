import { handlers } from "@generated";
import { setupServer } from "msw/node";

/**
 * Vitest / Node: start here; handlers & mocks come from Kubb (`pnpm generate`).
 */
export function createTvmazeMswServer() {
	return setupServer(...handlers);
}

export {
	createGetShowByIdQueryResponse,
	createGetShowsQueryResponse,
	createSearchShowsQueryResponse,
	createShow,
	handlers,
} from "@generated";
export { TARGET_GENRES, type TargetGenre } from "@src/config";
