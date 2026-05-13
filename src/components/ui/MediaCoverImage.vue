<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		src: string;
		alt?: string;
		layout?: "fill" | "block";
		loading?: HTMLImageElement["loading"];
		decoding?: HTMLImageElement["decoding"];
		fetchpriority?: HTMLImageElement["fetchPriority"];
		sizes?: string;
	}>(),
	{
		alt: "",
		layout: "fill",
		loading: "lazy",
		decoding: "async",
	},
);

const layoutClass = computed(() =>
	props.layout === "fill"
		? "absolute inset-0 h-full w-full object-cover"
		: "h-full w-full object-cover",
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
		draggable="false"
		:class="[layoutClass, 'ui-non-interactive-image']"
	/>
</template>
