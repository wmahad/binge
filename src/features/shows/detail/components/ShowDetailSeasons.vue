<script setup lang="ts">
import type { Season, Show } from "@generated";
import { AppSurface, ScrollableRow, SectionTitleRow } from "@src/components";
import { formatSeasonsKicker } from "@src/features/shows/detail/utils/seasonFormatting";
import { computed, toValue } from "vue";

import ShowDetailSeasonCard from "./ShowDetailSeasonCard.vue";

const SKELETON_SEASON_LOADING_KEYS = [0, 1, 2] as const;
const SKELETON_SEASON_LINE_CLASSES = [
	"ui-skeleton-detail-card-line-primary",
	"ui-skeleton-detail-card-line-secondary",
] as const;

const props = defineProps<{
	show: Show;
	seasons: Season[];
	loading: boolean;
	totalEpisodes: number;
}>();

const seasonsKickerText = computed(() =>
	formatSeasonsKicker(props.seasons.length, props.totalEpisodes),
);

const hasSeasons = computed(() => props.seasons.length > 0);
const showLoadingState = computed(
	() => toValue(props.loading) && !hasSeasons.value,
);
</script>

<template>
	<section v-if="showLoadingState" class="ui-page-section">
		<div class="ui-skeleton-section-title" />
		<div class="ui-skeleton-content-rail">
			<AppSurface
				v-for="key in SKELETON_SEASON_LOADING_KEYS"
				:key="key"
				class="ui-skeleton-season-card-shell"
			>
				<div class="ui-skeleton-season-card-poster" />
				<div class="ui-skeleton-season-card-meta">
					<div
						v-for="lineClass in SKELETON_SEASON_LINE_CLASSES"
						:key="lineClass"
						:class="lineClass"
					/>
				</div>
			</AppSurface>
		</div>
	</section>
	<section v-else-if="hasSeasons" class="ui-page-section">
		<SectionTitleRow title="Seasons" layout="withKicker">
			<template #kicker>{{ seasonsKickerText }}</template>
		</SectionTitleRow>
		<ScrollableRow variant="detailInset">
			<ShowDetailSeasonCard
				v-for="season in seasons"
				:key="season.id"
				:show="show"
				:season="season"
			/>
		</ScrollableRow>
	</section>
</template>
