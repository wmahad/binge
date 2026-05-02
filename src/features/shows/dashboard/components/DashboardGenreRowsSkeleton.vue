<script setup lang="ts">
import { AppContainer } from "@src/components";

/** Placeholder genre rails while the catalog request is in flight. */
const SKELETON_ROW_KEYS = [0, 1, 2, 3] as const;
const SKELETON_POSTER_KEYS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const SKELETON_GENRE_ROW_HEADER_CLASSES = [
	"ui-skeleton-genre-row-title",
	"ui-skeleton-genre-row-meta",
] as const;
const SKELETON_GENRE_ROW_POSTER_DETAIL_CLASSES = [
	"ui-skeleton-genre-row-poster",
	"ui-skeleton-genre-row-caption",
] as const;
</script>

<template>
	<section
		v-for="skeletonRowKey in SKELETON_ROW_KEYS"
		:key="skeletonRowKey"
		class="py-4"
	>
		<AppContainer variant="inset">
			<div class="mb-4 flex items-baseline justify-between gap-4">
				<div
					v-for="skeletonClass in SKELETON_GENRE_ROW_HEADER_CLASSES"
					:key="skeletonClass"
					:class="skeletonClass"
				/>
			</div>
			<div class="flex gap-3 overflow-hidden pb-4 md:gap-4">
				<div
					v-for="skeletonPosterKey in SKELETON_POSTER_KEYS"
					:key="skeletonPosterKey"
					class="ui-poster-rail-item"
				>
					<div
						v-for="skeletonClass in SKELETON_GENRE_ROW_POSTER_DETAIL_CLASSES"
						:key="skeletonClass"
						:class="skeletonClass"
					/>
				</div>
			</div>
		</AppContainer>
	</section>
</template>
