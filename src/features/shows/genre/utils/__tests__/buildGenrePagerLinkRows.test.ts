import { describe, expect, it } from "vitest";
import {
	buildGenrePagerLinkRows,
	GENRE_PAGER_PAGE_ACTIVE_CLASS,
	GENRE_PAGER_PAGE_INACTIVE_CLASS,
	genrePagerNextNavClass,
	genrePagerPrevNavClass,
} from "../buildGenrePagerLinkRows";

describe("buildGenrePagerLinkRows", () => {
	it("maps pages with active class on safePage", () => {
		const rows = buildGenrePagerLinkRows([1, 2, 3], 2);
		const pages = rows.filter((row) => row.kind === "page");
		expect(pages.find((pageRow) => pageRow.pageNumber === 2)?.linkClass).toBe(
			GENRE_PAGER_PAGE_ACTIVE_CLASS,
		);
		expect(pages.find((pageRow) => pageRow.pageNumber === 1)?.linkClass).toBe(
			GENRE_PAGER_PAGE_INACTIVE_CLASS,
		);
	});

	it("preserves ellipsis entries", () => {
		const rows = buildGenrePagerLinkRows([1, 5], 1);
		expect(rows.some((row) => row.kind === "ellipsis")).toBe(true);
	});
});

describe("genrePagerPrevNavClass", () => {
	it("disables at first page", () => {
		expect(genrePagerPrevNavClass(1)).toContain("pointer-events-none");
		expect(genrePagerPrevNavClass(2)).toContain("hover:bg-secondary");
	});
});

describe("genrePagerNextNavClass", () => {
	it("disables on last page", () => {
		expect(genrePagerNextNavClass(3, 3)).toContain("pointer-events-none");
		expect(genrePagerNextNavClass(1, 3)).toContain("hover:bg-secondary");
	});
});
