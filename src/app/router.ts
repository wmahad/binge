import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "dashboard",
			component: () => import("@src/features/shows/dashboard/page.vue"),
		},
		{
			path: "/search",
			name: "search",
			component: () => import("@src/features/shows/search/page.vue"),
		},
		{
			path: "/shows/:id",
			name: "show-details",
			component: () => import("@src/features/shows/detail/page.vue"),
			props: true,
		},
		{
			path: "/genres/:genre",
			name: "genre-detail",
			component: () => import("@src/features/shows/genre/page.vue"),
			props: true,
		},
	],
});
