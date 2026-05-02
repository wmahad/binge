<script setup lang="ts">
import { computed } from "vue";

const CONTAINER_CLASS = {
	page: "min-h-screen px-4 py-6 md:px-12 md:py-10",
	inset: "px-4 md:px-12",
} as const;

const props = withDefaults(
	defineProps<{
		variant?: "page" | "inset";
	}>(),
	{ variant: "page" },
);

const containerClass = computed(() => CONTAINER_CLASS[props.variant]);
</script>

<template>
	<div :class="containerClass">
		<slot />
	</div>
</template>
