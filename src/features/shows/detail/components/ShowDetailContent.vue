<script setup lang="ts">
import { getShowSeasons, type Season, type Show } from "@generated";
import { preferredImageUrl } from "@src/features/shows/detail/utils/mediaUrls";
import {
	totalEpisodesFromSeasons,
} from "@src/features/shows/detail/utils/seasonFormatting";
import {
	ratingToFilledStarCount,
	showSummaryPlain,
} from "@src/features/shows/detail/utils/showFormatting";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

import ShowDetailCast from "./ShowDetailCast.vue";
import ShowDetailCreators from "./ShowDetailCreators.vue";
import ShowDetailHero from "./ShowDetailHero.vue";
import ShowDetailSeasons from "./ShowDetailSeasons.vue";
import ShowDetailSimilar from "./ShowDetailSimilar.vue";

const props = defineProps<{
	show: Show;
}>();

const seasonsQuery = useQuery({
	queryKey: computed(() => ["show-seasons", props.show.id] as const),
	queryFn: async () => {
		try {
			return (await getShowSeasons(props.show.id)) ?? [];
		} catch {
			return [];
		}
	},
});

const seasons = computed<Season[]>(() => seasonsQuery.data.value ?? []);
const seasonsPending = computed(() => seasonsQuery.isPending.value);

const rating = computed(() => props.show.rating?.average ?? null);
const filledStarCount = computed(() =>
	ratingToFilledStarCount(rating.value),
);

const totalEpisodes = computed(() =>
	totalEpisodesFromSeasons(seasons.value),
);

const heroImageUrl = computed(() => preferredImageUrl(props.show.image));

const summaryPlain = computed(() => showSummaryPlain(props.show.summary));

function shareShow() {
	const title = props.show.name;
	const url = typeof window !== "undefined" ? window.location.href : "";
	if (navigator.share) {
		void navigator.share({ title, url }).catch(() => {});
	} else {
		void navigator.clipboard?.writeText(url);
	}
}
</script>

<template>
	<div class="pb-20">
		<ShowDetailHero
			:show="show"
			:hero-image-url="heroImageUrl"
			:summary-plain="summaryPlain"
			:rating="rating"
			:filled-star-count="filledStarCount"
			:total-episodes="totalEpisodes"
			:seasons="seasons"
			@share="shareShow"
		/>

		<ShowDetailSeasons
			:key="`seasons-${show.id}`"
			:show="show"
			:seasons="seasons"
			:loading="seasonsPending"
			:total-episodes="totalEpisodes"
		/>

		<ShowDetailCreators :show-name="show.name" :show-id="show.id" />

		<ShowDetailCast :show-id="show.id" />

		<ShowDetailSimilar :show="show" :show-id="show.id" />
	</div>
</template>
