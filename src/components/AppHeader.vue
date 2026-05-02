<script setup lang="ts">

import { AppIconButton, SiteSearchInput } from "@src/components";
import { isUndefined } from "@src/utils";
import { Search, Tv, X } from "lucide-vue-next";
import { nextTick, onUnmounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

import ThemeToggle from "./ThemeToggle.vue";

const router = useRouter();
const route = useRoute();

const searchQuery = ref("");
const isMobileSearchOpen = ref(false);

/** True while `searchQuery` is being set from the URL so we don't loop back into debounced navigation */
let syncingFromRoute = false;

/** How long to wait after typing stops before updating the URL / triggering search (ms) */
const SEARCH_DEBOUNCE_MS = 750;

let debounceTimer: ReturnType<typeof setTimeout> | undefined;

function applySearchRoute() {
	const trimmed = searchQuery.value.trim();
	if (!trimmed) {
		if (route.path === "/search") {
			void router.replace({ path: "/" });
		}
		return;
	}
	if (route.path === "/search") {
		void router.replace({ path: "/search", query: { q: trimmed } });
	} else {
		void router.push({ path: "/search", query: { q: trimmed } });
	}
}

function scheduleDebouncedSearch() {
	if (!isUndefined(debounceTimer)) clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		debounceTimer = undefined;
		applySearchRoute();
	}, SEARCH_DEBOUNCE_MS);
}

function cancelDebouncedSearch() {
	if (!isUndefined(debounceTimer)) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}
}

function syncSearchQueryFromRoute(nextValue: string) {
	syncingFromRoute = true;
	searchQuery.value = nextValue;
	void nextTick(() => {
		syncingFromRoute = false;
	});
}

onUnmounted(() => {
	cancelDebouncedSearch();
});

watch(
	() => [route.path, route.query.q] as const,
	() => {
		if (route.path !== "/search") {
			if (searchQuery.value !== "") {
				syncSearchQueryFromRoute("");
			}
			return;
		}
		const fromRoute = String(route.query.q ?? "");
		if (fromRoute !== searchQuery.value) {
			syncSearchQueryFromRoute(fromRoute);
		}
	},
	{ immediate: true },
);

watch(searchQuery, () => {
	if (syncingFromRoute) return;
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
