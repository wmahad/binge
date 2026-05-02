import type { Season, Show } from "@generated";
import { isNullish } from "@src/utils";
import { Calendar, Clock, Globe, Layers, Tv2 } from "lucide-vue-next";
import type { Component } from "vue";

import { formatSeasonsKicker } from "./seasonFormatting";

export type ShowHeroFactRow = {
	id: string;
	icon: Component;
	text: string;
};

type FactContext = {
	show: Show;
	seasons: Season[];
	seasonsSummary: string;
};

const FACT_BUILDERS: ReadonlyArray<{
	id: string;
	icon: Component;
	resolveText: (context: FactContext) => string | null;
}> = [
	{
		id: "runtime",
		icon: Clock,
		resolveText: ({ show }) =>
			show.runtime ? `${show.runtime} min episodes` : null,
	},
	{
		id: "network",
		icon: Tv2,
		resolveText: ({ show }) =>
			show.network ? (show.network.name ?? "") : null,
	},
	{
		id: "language",
		icon: Globe,
		resolveText: ({ show }) => (show.language ? (show.language ?? "") : null),
	},
	{
		id: "premiered",
		icon: Calendar,
		resolveText: ({ show }) =>
			show.premiered ? `Since ${show.premiered.slice(0, 4)}` : null,
	},
	{
		id: "seasons",
		icon: Layers,
		resolveText: ({ seasons, seasonsSummary }) =>
			seasons.length > 0 ? seasonsSummary : null,
	},
];

/** Labels for the show detail hero meta row (runtime, network, seasons, …). */
export function buildShowHeroFactRows(
	show: Show,
	seasons: Season[],
	totalEpisodes: number,
): ShowHeroFactRow[] {
	const seasonsSummary = formatSeasonsKicker(seasons.length, totalEpisodes);
	const context: FactContext = { show, seasons, seasonsSummary };

	return FACT_BUILDERS.flatMap((builder) => {
		const text = builder.resolveText(context);
		if (isNullish(text)) return [];
		return [{ id: builder.id, icon: builder.icon, text }];
	});
}
