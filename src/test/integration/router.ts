import DashboardPage from "@src/features/shows/dashboard/page.vue";
import DetailPage from "@src/features/shows/detail/page.vue";
import GenrePage from "@src/features/shows/genre/page.vue";
import SearchPage from "@src/features/shows/search/page.vue";
import type { Component } from "vue";
import { defineComponent } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";

export const IntegrationShowDetailStub = defineComponent({
	name: "IntegrationShowDetailStub",
	template: `
		<main>
			<h1>Show detail</h1>
			<p role="status" :aria-label="'Show id ' + $route.params.id">Show id {{ $route.params.id }}</p>
		</main>
	`,
});

export const IntegrationGenreExploreStub = defineComponent({
	name: "IntegrationGenreExploreStub",
	template: `
		<main>
			<h1>Genre explore</h1>
			<p role="status" :aria-label="'Genre ' + $route.params.genre">Genre {{ $route.params.genre }}</p>
		</main>
	`,
});

export const IntegrationSearchStub = defineComponent({
	name: "IntegrationSearchStub",
	template: `
		<main>
			<h1>Search</h1>
			<p role="status" :aria-label="'Search query ' + ($route.query.q ?? '')">
				q={{ $route.query.q ?? '' }}
			</p>
		</main>
	`,
});

export type IntegrationRouterOptions = {
	detailPage?: Component;
	genrePage?: Component;
	searchPage?: Component;
};

export function createIntegrationRouter(
	dashboard: Component,
	options: IntegrationRouterOptions = {},
) {
	const showDetail = options.detailPage ?? IntegrationShowDetailStub;
	const genreExplore = options.genrePage ?? IntegrationGenreExploreStub;
	const search = options.searchPage ?? IntegrationSearchStub;
	return createRouter({
		history: createMemoryHistory(),
		routes: [
			{ path: "/", component: dashboard },
			{ path: "/genres/:genre", component: genreExplore, props: true },
			{ path: "/shows/:id", component: showDetail, props: true },
			{ path: "/search", component: search },
		],
	});
}

export function createFullIntegrationRouter() {
	return createIntegrationRouter(DashboardPage, {
		detailPage: DetailPage,
		genrePage: GenrePage,
		searchPage: SearchPage,
	});
}
