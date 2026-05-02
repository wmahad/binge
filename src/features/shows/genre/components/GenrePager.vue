<script setup lang="ts">
import { AppText } from "@src/components";
import {
	buildGenrePagerLinkRows,
	genrePagerNextNavClass,
	genrePagerPrevNavClass,
} from "@src/features/shows/genre/utils/buildGenrePagerLinkRows";
import type { GenreSortKey } from "@src/features/shows/genre/utils/sortShows";
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps<{
	genreSlug: string;
	sort: GenreSortKey;
	pagerPages: number[];
	safePage: number;
	totalPages: number;
	prevPage: number;
	nextPage: number;
}>();

const pagerEntries = computed(() =>
	buildGenrePagerLinkRows(props.pagerPages, props.safePage),
);

const prevNavClass = computed(() => genrePagerPrevNavClass(props.safePage));

const nextNavClass = computed(() =>
	genrePagerNextNavClass(props.safePage, props.totalPages),
);
</script>

<template>
	<div class="ui-genre-pager-shell">
		<RouterLink
			:to="{ path: `/genres/${genreSlug}`, query: { page: prevPage, sort } }"
			class="ui-genre-pager-nav"
			:class="prevNavClass"
		>
			Prev
		</RouterLink>
		<template v-for="entry in pagerEntries" :key="entry.id">
			<AppText v-if="entry.kind === 'ellipsis'" as="span" variant="muted">
				…
			</AppText>
			<RouterLink
				v-else
				:to="{
					path: `/genres/${genreSlug}`,
					query: { page: entry.pageNumber, sort },
				}"
				:class="['ui-genre-pager-page-link', entry.linkClass]"
			>
				{{ entry.pageNumber }}
			</RouterLink>
		</template>
		<RouterLink
			:to="{ path: `/genres/${genreSlug}`, query: { page: nextPage, sort } }"
			class="ui-genre-pager-nav"
			:class="nextNavClass"
		>
			Next
		</RouterLink>
	</div>
</template>
