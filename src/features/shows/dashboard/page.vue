<script setup lang="ts">
import { useShowsCatalogQueries } from "@src/composables";
import { TARGET_GENRES } from "@src/config";
import { groupShowsByGenre } from "@src/features/shows/dashboard/utils/groupShowsByGenre";
import { pickFeaturedCarouselShows } from "@src/features/shows/dashboard/utils/pickFeaturedCarouselShows";
import { errorMessageFromUnknown } from "@src/utils";
import { computed } from "vue";
import DashboardCatalogError from "./components/DashboardCatalogError.vue";
import DashboardGenreRowsSkeleton from "./components/DashboardGenreRowsSkeleton.vue";
import DashboardHeroSkeleton from "./components/DashboardHeroSkeleton.vue";
import FeaturedShowsCarousel from "./components/FeaturedShowsCarousel.vue";
import GenreRow from "./components/GenreRow.vue";

const { loading, mergedShows, firstError, refetchAll } = useShowsCatalogQueries(
	[0, 1],
);

const grouped = computed(() => groupShowsByGenre(mergedShows.value));

const featuredPool = computed(() =>
	pickFeaturedCarouselShows(mergedShows.value),
);

const errorDetail = computed(() =>
	errorMessageFromUnknown(firstError.value, "Request failed"),
);

/** Overlap + “sheet” only when a hero block is shown; avoids pulling rows up when there is no carousel. */
const hasHero = computed(
	() => loading.value || featuredPool.value.length > 0,
);

</script>

<template>
	<div class="min-h-screen">
		<DashboardHeroSkeleton v-if="loading" />
		<FeaturedShowsCarousel v-else-if="featuredPool.length > 0" :shows="featuredPool" />

		<div
			:class="[
				'pb-20',
				hasHero
					? 'ui-dashboard-rows-shell-with-hero'
					: 'ui-dashboard-rows-shell',
			]"
		>
			<DashboardGenreRowsSkeleton v-if="loading" />
			<DashboardCatalogError
				v-else-if="firstError"
				:detail="errorDetail"
				@retry="refetchAll"
			/>
			<template v-else>
				<GenreRow
					v-for="genre in TARGET_GENRES"
					:key="genre"
					:genre="genre"
					:shows="grouped.get(genre) ?? []"
				/>
			</template>
		</div>
	</div>
</template>
