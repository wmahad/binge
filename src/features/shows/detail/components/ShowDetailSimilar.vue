<script setup lang="ts">
import type { Show } from "@generated";
import { ScrollableRow, SectionTitleRow, ShowCard } from "@src/components";
import { useShowCast, useShowSimilarContent } from "@src/composables";
import { prefetchImageUrl, showPosterSrc } from "@src/utils";
import { computed, toValue, watch } from "vue";

const props = defineProps<{
	show: Show;
	showId: number;
}>();

const castQuery = useShowCast(computed(() => props.showId));
const similarQuery = useShowSimilarContent(
	computed(() => props.showId),
	computed(() => props.show),
	computed(() => castQuery.data.value),
);
const similar = computed(() => similarQuery.data.value?.similar ?? []);
const hasSimilar = computed(() => similar.value.length > 0);
const showLoadingState = computed(
	() =>
		(toValue(castQuery.isPending) || toValue(similarQuery.isPending)) &&
		!hasSimilar.value,
);

const blurb = computed(
	() => `Shows sharing cast & genres with ${props.show.name}`,
);

const MAX_SIMILAR_POSTER_PREFETCH = 12;

watch(
	similar,
	(similarShows) => {
		for (const show of similarShows.slice(
			0,
			MAX_SIMILAR_POSTER_PREFETCH,
		)) {
			prefetchImageUrl(showPosterSrc(show));
		}
	},
	{ immediate: true },
);
</script>

<template>
	<section v-if="showLoadingState" class="ui-page-section">
		<div class="ui-skeleton-section-title" />
		<div class="ui-skeleton-content-rail">
			<div
				v-for="key in [0, 1, 2, 3]"
				:key="key"
				class="animate-pulse ui-skeleton-surface-xl h-52 min-w-60"
			/>
		</div>
	</section>
	<section v-else-if="hasSimilar" class="ui-page-section">
		<SectionTitleRow
			title="More Like This"
			layout="withBlurb"
			:blurb="blurb"
		/>
		<ScrollableRow variant="detail">
			<ShowCard
				v-for="similarShow in similar"
				:key="similarShow.id"
				:show="similarShow"
			/>
		</ScrollableRow>
	</section>
</template>
