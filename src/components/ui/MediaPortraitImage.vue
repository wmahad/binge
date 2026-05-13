<script setup lang="ts">
withDefaults(
	defineProps<{
		src: string;
		alt: string;
		loading?: HTMLImageElement["loading"];
		decoding?: HTMLImageElement["decoding"];
		fetchpriority?: HTMLImageElement["fetchPriority"];
		sizes?: string;
	}>(),
	{
		loading: "lazy",
		decoding: "async",
	},
);
</script>

<template>
	<img
		:src
		:alt
		:sizes
    :loading
		:decoding
		:fetchpriority
		class="ui-media-portrait-image ui-non-interactive-image"
		draggable="false"
	/>
</template>
