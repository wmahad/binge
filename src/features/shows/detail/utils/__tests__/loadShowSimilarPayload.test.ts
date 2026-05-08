import type { CastMember, Show } from "@generated";
import {
	getPersonCastcreditsHandler,
	getPersonCastcreditsHandlerResponse200,
	getShowCastHandler,
	getShowCastHandlerResponse200,
	getShowsHandler,
	getShowsHandlerResponse200,
} from "@src/generated/msw/msw";
import { mswWorker } from "@src/test/msw-worker";
import { describe, expect, it } from "vitest";
import { loadShowSimilarPayload } from "../loadShowSimilarPayload";

function showJson(id: number, rating = 7, genres: string[] = []): Show {
	return {
		id,
		name: `S${id}`,
		genres,
		rating: { average: rating },
	} as Show;
}

function castRow(personId: number): CastMember {
	return {
		person: { id: personId, name: "" },
		character: { id: 0, name: "" },
	};
}

describe("loadShowSimilarPayload", () => {
	it("returns cast overlap only when at least four shared shows (no catalog fetch)", async () => {
		const target = showJson(1, 7, ["Drama"]);
		mswWorker.use(
			getShowCastHandler(() =>
				getShowCastHandlerResponse200([
					castRow(101),
					castRow(102),
					castRow(103),
					castRow(104),
					castRow(105),
				]),
			),
			getPersonCastcreditsHandler((info) => {
				const id = String(info.params.id);
				if (id === "101")
					return getPersonCastcreditsHandlerResponse200([
						{ _embedded: { show: showJson(2, 9) } },
					]);
				if (id === "102")
					return getPersonCastcreditsHandlerResponse200([
						{ _embedded: { show: showJson(3, 8) } },
					]);
				if (id === "103")
					return getPersonCastcreditsHandlerResponse200([
						{ _embedded: { show: showJson(4, 7) } },
					]);
				if (id === "104")
					return getPersonCastcreditsHandlerResponse200([
						{ _embedded: { show: showJson(5, 6) } },
					]);
				return getPersonCastcreditsHandlerResponse200([]);
			}),
			getShowsHandler(() => {
				throw new Error("getShows should not run when cast overlap is enough");
			}),
		);

		const out = await loadShowSimilarPayload(target);

		expect(out.similar.map((show) => show.id)).toEqual([2, 3, 4, 5]);
		expect(out.cast.map((member) => member.person.id)).toEqual([
			101, 102, 103, 104, 105,
		]);
	});

	it("pads with genre overlap when cast overlap is thin", async () => {
		const target = showJson(1, 7, ["Drama"]);
		const pool = [
			target,
			showJson(2, 9),
			showJson(3, 8),
			showJson(4, 7),
			showJson(5, 9, ["Drama"]),
			showJson(6, 10, ["Comedy"]),
		];
		mswWorker.use(
			getShowCastHandler(() =>
				getShowCastHandlerResponse200([
					castRow(101),
					castRow(102),
					castRow(103),
				]),
			),
			getPersonCastcreditsHandler((info) => {
				const id = String(info.params.id);
				if (id === "101")
					return getPersonCastcreditsHandlerResponse200([
						{ _embedded: { show: showJson(2, 9) } },
					]);
				if (id === "102")
					return getPersonCastcreditsHandlerResponse200([
						{ _embedded: { show: showJson(3, 8) } },
					]);
				if (id === "103")
					return getPersonCastcreditsHandlerResponse200([
						{ _embedded: { show: showJson(4, 7) } },
					]);
				return getPersonCastcreditsHandlerResponse200([]);
			}),
			getShowsHandler(() => getShowsHandlerResponse200(pool)),
		);

		const out = await loadShowSimilarPayload(target);

		expect(out.similar.map((show) => show.id)).toEqual([2, 3, 4, 5]);
	});
});
