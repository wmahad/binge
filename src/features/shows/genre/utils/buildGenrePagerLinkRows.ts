import { buildPagerModelEntries } from "./buildPagerModelEntries";

export const GENRE_PAGER_PAGE_ACTIVE_CLASS =
	"bg-primary font-semibold text-primary-foreground" as const;
export const GENRE_PAGER_PAGE_INACTIVE_CLASS =
	"border border-border hover:bg-secondary" as const;

export type GenrePagerLinkRow =
	| { kind: "ellipsis"; id: string }
	| {
			kind: "page";
			id: number;
			pageNumber: number;
			linkClass: string;
	  };

export function buildGenrePagerLinkRows(
	visiblePageNumbers: readonly number[],
	safePage: number,
): GenrePagerLinkRow[] {
	const rows: GenrePagerLinkRow[] = [];
	for (const entry of buildPagerModelEntries(visiblePageNumbers)) {
		if (entry.kind === "ellipsis") {
			rows.push(entry);
			continue;
		}
		rows.push({
			kind: "page",
			id: entry.pageNumber,
			pageNumber: entry.pageNumber,
			linkClass:
				entry.pageNumber === safePage
					? GENRE_PAGER_PAGE_ACTIVE_CLASS
					: GENRE_PAGER_PAGE_INACTIVE_CLASS,
		});
	}
	return rows;
}

export function genrePagerPrevNavClass(safePage: number): string {
	return safePage <= 1
		? "pointer-events-none opacity-40"
		: "hover:bg-secondary";
}

export function genrePagerNextNavClass(
	safePage: number,
	totalPages: number,
): string {
	return safePage >= totalPages
		? "pointer-events-none opacity-40"
		: "hover:bg-secondary";
}
