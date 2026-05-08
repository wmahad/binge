<script setup lang="ts">
import {
	AppContainer,
	AppHeading,
	AppKicker,
	AppSectionHeader,
	AppText,
	PillLink,
	ShowCard,
} from "@src/components";
import { useShowsCatalogQueries } from "@src/composables";
import {
	filterSortShowsByGenre,
	GENRE_SORT_KEYS,
	genreSortLabel,
	parseGenreSortKey,
} from "@src/features/shows/genre/utils/sortShows";
import {
	buildNeighborPages,
	clampToRange,
	nextPageNumber,
	parsePositiveNumber,
	prevPageNumber,
	slicePageWindow,
	totalPagesFromLength,
} from "@src/utils";
import { computed } from "vue";
import { useRoute } from "vue-router";
import GenreGridSkeleton from "./components/GenreGridSkeleton.vue";
import GenrePager from "./components/GenrePager.vue";

const PAGE_SIZE = 24;

const route = useRoute();

const genreDecoded = computed(() =>
	decodeURIComponent(String(route.params.genre ?? "")),
);

const sort = computed(() => parseGenreSortKey(route.query.sort));

const pageNum = computed(() => parsePositiveNumber(route.query.page));

const genreParam = computed(() => String(route.params.genre ?? ""));

const { loading, mergedShows: allShows } = useShowsCatalogQueries([0, 1, 2, 3]);

const filtered = computed(() =>
	filterSortShowsByGenre(allShows.value, genreDecoded.value, sort.value),
);

const totalPages = computed(() =>
	totalPagesFromLength(filtered.value.length, PAGE_SIZE),
);

const safePage = computed(() => clampToRange(pageNum.value, 1, totalPages.value));

const visible = computed(() =>
	slicePageWindow(filtered.value, safePage.value, PAGE_SIZE),
);

const pagerPages = computed(() =>
	buildNeighborPages(totalPages.value, safePage.value),
);

const prevPage = computed(() => prevPageNumber(safePage.value));
const nextPage = computed(() =>
	nextPageNumber(safePage.value, totalPages.value),
);
</script>

<template>
	<AppContainer variant="page">
		<AppSectionHeader variant="page">
			<template #title>
				<AppKicker variant="eyebrowPrimary">
					Genre
				</AppKicker>
				<AppHeading
					variant="genreHero"
					:level="1"
					class="mt-2 mb-0"
				>
					{{ genreDecoded }}
				</AppHeading>
				<AppText variant="muted" class="mt-2">
					{{ loading ? "Loading…" : `${filtered.length} shows` }}
				</AppText>
			</template>

			<template #action>
				<div class="ui-stack gap-3 sm:flex-row sm:items-center">
					<AppKicker variant="fieldLabel" as="label" class="shrink-0">
						Sort by
					</AppKicker>
					<div class="ui-chip-row">
						<PillLink
							v-for="sortOption in GENRE_SORT_KEYS"
							:key="sortOption"
							variant="chip"
							:selected="sort === sortOption"
							:to="{
								path: `/genres/${genreParam}`,
								query: { sort: sortOption, page: 1 },
							}"
						>
							{{ genreSortLabel(sortOption) }}
						</PillLink>
					</div>
				</div>
			</template>
		</AppSectionHeader>

		<GenreGridSkeleton v-if="loading" />

		<AppText
			v-else-if="filtered.length === 0"
			variant="muted"
			class="py-32 text-center"
		>
			No shows found for {{ genreDecoded }}.
		</AppText>

		<template v-else>
			<div class="ui-poster-grid">
				<ShowCard
					v-for="visibleShow in visible"
					:key="visibleShow.id"
					:show="visibleShow"
					fluid
				/>
			</div>

			<GenrePager
				v-if="totalPages > 1"
				:genre-slug="genreParam"
				:sort="sort"
				:pager-pages="pagerPages"
				:safe-page="safePage"
				:total-pages="totalPages"
				:prev-page="prevPage"
				:next-page="nextPage"
			/>
		</template>
	</AppContainer>
</template>
