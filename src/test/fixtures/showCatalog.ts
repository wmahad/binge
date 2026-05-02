import type { Show } from "@generated";
import { createImage, createShow } from "@src/generated/mocks/faker";
import { distinctDisplayName } from "@src/test/msw/integrationStubs";

export function catalogHeroAndComedy(): { hero: Show; comedy: Show } {
	const hero = createShow({
		id: 88_001,
		name: distinctDisplayName(77_001),
		genres: ["Drama"],
		rating: { average: 9.2 },
		image: createImage({
			original: "https://example.invalid/hero-original.jpg",
			medium: "https://example.invalid/hero-medium.jpg",
		}),
	});
	const comedy = createShow({
		id: 88_002,
		name: distinctDisplayName(77_002),
		genres: ["Comedy"],
		rating: { average: 8.8 },
		image: createImage({
			original: "https://example.invalid/comedy-original.jpg",
			medium: "https://example.invalid/comedy-medium.jpg",
		}),
	});
	return { hero, comedy };
}

export function catalogHeroAndComedyShows(): Show[] {
	const { hero, comedy } = catalogHeroAndComedy();
	return [hero, comedy];
}
