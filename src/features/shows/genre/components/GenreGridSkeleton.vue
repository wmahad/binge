<script setup lang="ts">
const SKELETON_CARD_COUNT = 18;
const SKELETON_CARD_CLASSES = [
	"ui-skeleton-genre-grid-poster",
	"ui-skeleton-genre-grid-caption",
] as const;
</script>

<template>
	<div class="ui-poster-grid">
		<div v-for="index in SKELETON_CARD_COUNT" :key="index" class="w-full">
			<div
				v-for="skeletonClass in SKELETON_CARD_CLASSES"
				:key="skeletonClass"
				:class="skeletonClass"
			/>
		</div>
	</div>
</template>
