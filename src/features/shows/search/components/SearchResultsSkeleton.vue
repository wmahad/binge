<script setup lang="ts">
const SKELETON_RESULT_KEYS = [0, 1, 2, 3, 4, 5] as const;
const SKELETON_RESULT_LINE_CLASSES = [
	"ui-skeleton-search-result-title-line",
	"ui-skeleton-search-result-line-sm",
	"ui-skeleton-search-result-line-full",
	"ui-skeleton-search-result-line-wide",
	"ui-skeleton-search-result-line-mid",
] as const;
</script>

<template>
	<div class="ui-search-results-grid">
		<div
			v-for="key in SKELETON_RESULT_KEYS"
			:key="key"
			class="ui-skeleton-search-result-card"
		>
			<div class="ui-skeleton-search-result-poster" />
			<div class="ui-skeleton-search-result-content">
				<div
					v-for="skeletonClass in SKELETON_RESULT_LINE_CLASSES"
					:key="skeletonClass"
					:class="skeletonClass"
				/>
			</div>
		</div>
	</div>
</template>
