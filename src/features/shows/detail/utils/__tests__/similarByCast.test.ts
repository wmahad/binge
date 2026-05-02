import type { CastMember, Show } from "@generated";
import {
	getPersonCastcreditsHandler,
	getPersonCastcreditsHandlerResponse200,
	getShowCastHandler,
	getShowCastHandlerResponse200,
} from "@src/generated/msw/msw";
import { mswWorker } from "@src/test/msw-worker";
import { describe, expect, it } from "vitest";
import { fetchSimilarByCast } from "../similarByCast";

function showJson(id: number, rating = 7): Show {
	return {
		id,
		name: `S${id}`,
		genres: [],
		rating: { average: rating },
	} as Show;
}

function castRow(personId: number): CastMember {
	return {
		person: { id: personId, name: "" },
		character: { id: 0, name: "" },
	};
}

describe("fetchSimilarByCast", () => {
	it("uses preloaded cast and does not request show cast", async () => {
		mswWorker.use(
			getPersonCastcreditsHandler((info) => {
				const id = String(info.params.id);
				if (id === "1") {
					return getPersonCastcreditsHandlerResponse200([
						{ _embedded: { show: showJson(10, 8) } },
					]);
				}
				return getPersonCastcreditsHandlerResponse200([]);
			}),
			getShowCastHandler(() => {
				throw new Error("getShowCast should not run when cast is preloaded");
			}),
		);

		const out = await fetchSimilarByCast(99, 5, [castRow(1)]);
		expect(out.shared.map((show) => show.id)).toEqual([10]);
		expect(out.cast.map((member) => member.person.id)).toEqual([1]);
	});

	it("fetches cast when not preloaded", async () => {
		let requestedId: string | undefined;
		mswWorker.use(
			getShowCastHandler((info) => {
				requestedId = info.params.id as string;
				return getShowCastHandlerResponse200([castRow(7)]);
			}),
			getPersonCastcreditsHandler(() =>
				getPersonCastcreditsHandlerResponse200([]),
			),
		);

		await fetchSimilarByCast(5);
		expect(requestedId).toBe("5");
	});

	it("aggregates shared shows by overlap count and excludes the source show", async () => {
		const sharedByFirstCast = showJson(2, 9);
		const sharedBySecondCast = showJson(3, 8);
		mswWorker.use(
			getPersonCastcreditsHandler((info) => {
				const id = String(info.params.id);
				if (id === "1") {
					return getPersonCastcreditsHandlerResponse200([
						{ _embedded: { show: sharedByFirstCast } },
						{ _embedded: { show: showJson(1, 10) } },
					]);
				}
				if (id === "2") {
					return getPersonCastcreditsHandlerResponse200([
						{ _embedded: { show: sharedByFirstCast } },
						{ _embedded: { show: sharedBySecondCast } },
					]);
				}
				return getPersonCastcreditsHandlerResponse200([]);
			}),
			getShowCastHandler(() => {
				throw new Error("getShowCast should not run when cast is preloaded");
			}),
		);

		const out = await fetchSimilarByCast(1, 5, [castRow(1), castRow(2)]);
		expect(out.shared.map((show) => show.id)).toEqual([2, 3]);
		expect(out.cast.map((member) => member.person.id)).toEqual([1, 2]);
	});

	it("breaks aggregate ties by rating desc", async () => {
		const lowerRatedOverlap = showJson(10, 5);
		const higherRatedOverlap = showJson(11, 9);
		mswWorker.use(
			getPersonCastcreditsHandler(() =>
				getPersonCastcreditsHandlerResponse200([
					{ _embedded: { show: lowerRatedOverlap } },
					{ _embedded: { show: higherRatedOverlap } },
				]),
			),
			getShowCastHandler(() => {
				throw new Error("getShowCast should not run when cast is preloaded");
			}),
		);

		const out = await fetchSimilarByCast(1, 5, [castRow(1)]);
		expect(out.shared.map((show) => show.id)).toEqual([11, 10]);
	});

	it("returns empty shared when cast fetch fails", async () => {
		mswWorker.use(
			getShowCastHandler(() => new Response(null, { status: 500 })),
		);

		const out = await fetchSimilarByCast(3);
		expect(out.shared).toEqual([]);
		expect(out.cast).toEqual([]);
	});

	it("requests show cast using numeric id when show id is a string", async () => {
		let requestedId: string | undefined;
		mswWorker.use(
			getShowCastHandler((info) => {
				requestedId = info.params.id as string;
				return getShowCastHandlerResponse200([]);
			}),
			getPersonCastcreditsHandler(() =>
				getPersonCastcreditsHandlerResponse200([]),
			),
		);

		await fetchSimilarByCast("42");
		expect(requestedId).toBe("42");
	});
});
