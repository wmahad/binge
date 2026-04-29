import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "dashboard",
			component: () => import("@pages/dashboard/index.vue"),
		},
		{
			path: "/search",
			name: "search",
			component: () => import("@pages/search/index.vue"),
		},
		{
			path: "/shows/:id",
			name: "show-details",
			component: () => import("@pages/show/index.vue"),
			props: true,
		},
		{
			path: "/genres/:genre",
			name: "genre-detail",
			component: () => import("@pages/genre/index.vue"),
			props: true,
		},
	],
});
