import { isUndefined } from "@src/utils";

/**
 * Builds what the pager UI should render from an ordered list of page labels only
 * (not every page). Example input `[1, 2, 10, 11]` means “show 1, 2, then jump to 10, 11”.
 * Whenever two adjacent numbers in that list are not consecutive (here 2 → 10),
 * inserts an ellipsis between them so you get `1`, `2`, `…`, `10`, `11`.
 */
export type PagerModelEntry =
	| { kind: "ellipsis"; id: string }
	| { kind: "page"; pageNumber: number };

export function buildPagerModelEntries(
	visiblePageNumbers: readonly number[],
): PagerModelEntry[] {
	const entries: PagerModelEntry[] = [];
	let previousPage: number | undefined;
	for (const pageNumber of visiblePageNumbers) {
		if (!isUndefined(previousPage) && pageNumber - previousPage > 1) {
			entries.push({ kind: "ellipsis", id: `gap-before-${pageNumber}` });
		}
		entries.push({ kind: "page", pageNumber });
		previousPage = pageNumber;
	}
	return entries;
}
