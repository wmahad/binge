import { isUndefined } from "./guards";
import { parseFiniteNumber } from "./number";

export function clampToRange(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function parsePositiveNumber(raw: unknown, fallback = 1): number {
	const parsed = parseFiniteNumber(raw);
	return !isUndefined(parsed) && parsed >= 1 ? parsed : fallback;
}

export function totalPagesFromLength(length: number, pageSize: number): number {
	return Math.max(1, Math.ceil(length / pageSize));
}

export function slicePageWindow<T>(
	items: readonly T[],
	page: number,
	pageSize: number,
): T[] {
	const start = (page - 1) * pageSize;
	return items.slice(start, start + pageSize);
}

/** First, last, and neighbors around the current page (sorted). */
export function buildNeighborPages(
	totalPages: number,
	currentPage: number,
	neighborRadius = 2,
): number[] {
	const pages = new Set<number>([1, totalPages]);
	for (
		let page = currentPage - neighborRadius;
		page <= currentPage + neighborRadius;
		page++
	) {
		if (page >= 1 && page <= totalPages) pages.add(page);
	}
	return Array.from(pages).sort((left, right) => left - right);
}

export function prevPageNumber(currentPage: number): number {
	return clampToRange(currentPage - 1, 1, currentPage);
}

export function nextPageNumber(
	currentPage: number,
	totalPages: number,
): number {
	return clampToRange(currentPage + 1, 1, totalPages);
}
