<script setup lang="ts">
import { useSearchShows } from "@generated";
import {
	AppButton,
	AppContainer,
	AppHeading,
	AppText,
	PillLink,
} from "@src/components";
import { Search, SearchX, Sparkles } from "lucide-vue-next";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import SearchHitCard from "./components/SearchHitCard.vue";
import SearchResultsSkeleton from "./components/SearchResultsSkeleton.vue";

const route = useRoute();
const router = useRouter();

const searchQuery = computed(() => String(route.query.q ?? "").trim());

const searchParams = computed(() => ({
	q: searchQuery.value.length > 0 ? searchQuery.value : "x",
}));

const enabled = computed(() => searchQuery.value.length > 0);

const { data: rawResults, isPending: loading } = useSearchShows(searchParams, {
	query: {
		enabled,
	},
});

const results = computed(() => rawResults.value ?? []);
const statusMessage = computed(() => {
	if (searchQuery.value && loading.value) return "Searching…";
	if (searchQuery.value) return `${results.value.length} shows found`;
	return "Type a show name in the bar above.";
});

const suggestions = [
	"Breaking Bad",
	"Game of Thrones",
	"Friends",
	"Stranger Things",
];

function goSearch(term: string) {
	void router.push({ path: "/search", query: { q: term } });
}
</script>

<template>
	<AppContainer variant="page">
		<AppHeading
			variant="searchHero"
			:level="1"
			class="mb-2"
		>
			<template v-if="searchQuery">
				Results for "<span class="text-primary">{{ searchQuery }}</span>"
			</template>
			<template v-else>Search</template>
		</AppHeading>
		<AppText
			as="p"
			variant="mutedResponsive"
			class="ui-search-status-text"
		>
			{{ statusMessage }}
		</AppText>

		<Transition
			mode="out-in"
			enter-active-class="transition-[opacity,transform] duration-300 ease-out motion-reduce:duration-0"
			enter-from-class="opacity-0 translate-y-2"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition-[opacity,transform] duration-200 ease-in motion-reduce:duration-0"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 -translate-y-1"
		>
			<SearchResultsSkeleton v-if="searchQuery && loading" key="loading" />

			<div
				v-else-if="!searchQuery"
				key="hint"
				class="ui-empty-state"
			>
				<div
					class="ui-search-empty-icon-wrap"
					:style="{ background: 'var(--gradient-hero)' }"
				>
					<Search class="ui-search-empty-icon" aria-hidden="true" />
				</div>
				<AppHeading
					variant="emptyStateTitle"
					:level="2"
					class="mb-2"
				>
					Find your next binge
				</AppHeading>
				<AppText variant="muted" class="mb-6">
					Search thousands of TV shows by title — try one of these:
				</AppText>
				<div class="ui-chip-row justify-center">
					<AppButton
						v-for="suggestion in suggestions"
						:key="suggestion"
						variant="outline"
						size="pill-sm"
						class="hover:border-primary/40 hover:text-primary"
						@click="goSearch(suggestion)"
					>
						{{ suggestion }}
					</AppButton>
				</div>
			</div>

			<div
				v-else-if="searchQuery && results.length === 0"
				key="no-results"
				class="ui-empty-state"
			>
				<SearchX class="ui-search-empty-muted-icon" aria-hidden="true" />
				<AppHeading
					variant="emptyStateTitle"
					:level="2"
					class="mb-2"
				>
					No matches found
				</AppHeading>
				<AppText variant="muted" class="mb-6">
					We couldn't find any shows matching "<span class="text-foreground">{{
						searchQuery
					}}</span>". Try checking your spelling or using fewer keywords.
				</AppText>
				<PillLink to="/" variant="primary">
					<Sparkles class="h-4 w-4" aria-hidden="true" />
					Browse trending shows
				</PillLink>
			</div>

			<TransitionGroup
				v-else
				:key="`results-${searchQuery}`"
				tag="div"
				name="search-hit"
				class="ui-search-results-grid"
			>
				<SearchHitCard
					v-for="{ show } in results"
					:key="show.id"
					:show="show"
				/>
			</TransitionGroup>
		</Transition>
	</AppContainer>
</template>

<style scoped>
.search-hit-enter-active,
.search-hit-leave-active {
	transition:
		opacity 0.3s ease,
		transform 0.3s ease;
}
.search-hit-enter-from,
.search-hit-leave-to {
	opacity: 0;
	transform: translateY(8px);
}
.search-hit-move {
	transition: transform 0.35s ease;
}

@media (prefers-reduced-motion: reduce) {
	.search-hit-enter-active,
	.search-hit-leave-active,
	.search-hit-move {
		transition: none;
	}
	.search-hit-enter-from,
	.search-hit-leave-to {
		transform: none;
	}
}
</style>
