<script setup lang="ts">

import { AppIconButton, SiteSearchInput } from "@src/components";
import { Search, Tv, X } from "lucide-vue-next";
import { onUnmounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

import ThemeToggle from "./ThemeToggle.vue";

const router = useRouter();
const route = useRoute();

const SEARCH_ROUTE = "/search";
const HOME_ROUTE = "/";

const searchQuery = ref("");
const isMobileSearchOpen = ref(false);

const SEARCH_DEBOUNCE_MS = 750;
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

function queryFromRoute(): string {
	return String(route.query.q ?? "").trim();
}

function isOnSearchPage(): boolean {
	return route.path === SEARCH_ROUTE;
}

function navigateToSearch(q: string) {
	const to = { path: SEARCH_ROUTE, query: { q } };
	isOnSearchPage() ? router.replace(to) : router.push(to);
}

function routeAlreadyMatchesInput(): boolean {
	if (!isOnSearchPage()) return !searchQuery.value;
	return queryFromRoute() === searchQuery.value;
}

function applySearchRoute() {
	if (!searchQuery.value) {
		if (isOnSearchPage()) router.replace({ path: HOME_ROUTE });
		return;
	}
	if (isOnSearchPage() && queryFromRoute() === searchQuery.value) return;
	navigateToSearch(searchQuery.value);
}

function scheduleDebouncedSearch() {
	if (debounceTimer != null) clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		debounceTimer = undefined;
		applySearchRoute();
	}, SEARCH_DEBOUNCE_MS);
}

function cancelDebouncedSearch() {
	if (debounceTimer != null) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}
}

onUnmounted(cancelDebouncedSearch);

watch(
	() => [route.path, route.query.q] as const,
	() => {
		if (!isOnSearchPage()) {
			if (searchQuery.value !== "") searchQuery.value = "";
			return;
		}
		const fromRoute = queryFromRoute();
		if (fromRoute !== searchQuery.value) searchQuery.value = fromRoute;
	},
	{ immediate: true },
);

watch(searchQuery, () => {
	if (routeAlreadyMatchesInput()) return;
	scheduleDebouncedSearch();
});

function onSubmit() {
	cancelDebouncedSearch();
	applySearchRoute();
	isMobileSearchOpen.value = false;
}
</script>

<template>
	<header class="ui-header-shell">
		<div class="ui-header-toolbar">
			<RouterLink to="/" class="group ui-header-brand-link">
				<div
					class="ui-header-brand-mark"
					:style="{ background: 'var(--gradient-hero)' }"
				>
					<Tv class="h-4 w-4 text-primary-foreground md:h-5 md:w-5" aria-hidden="true" />
				</div>
				<span class="ui-header-brand-text">BINGE</span>
			</RouterLink>

			<SiteSearchInput
				v-model="searchQuery"
				class="ui-header-search-desktop"
				@submit="onSubmit"
			/>

			<AppIconButton
				variant="ghost"
				size="icon"
				class="ml-auto sm:hidden"
				:aria-label="isMobileSearchOpen ? 'Close search' : 'Open search'"
				@click="isMobileSearchOpen = !isMobileSearchOpen"
			>
				<X v-if="isMobileSearchOpen" class="h-4 w-4" aria-hidden="true" />
				<Search v-else class="h-4 w-4" aria-hidden="true" />
			</AppIconButton>

			<ThemeToggle />
		</div>

		<div v-if="isMobileSearchOpen" class="ui-header-mobile-search">
			<SiteSearchInput
				v-model="searchQuery"
				icon-left-class="left-7"
				@submit="onSubmit"
			/>
		</div>
	</header>
</template>
