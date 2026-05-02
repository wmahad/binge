<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
	variant: "detail" | "detailInset";
}>();

const SCROLLABLE_ROW_VARIANT_CLASS = {
	detail: "flex gap-3 pb-4 md:gap-4",
	detailInset: "-mx-1 flex gap-4 px-1 py-1.5 pb-3",
} as const;

const variantClass = computed(() => SCROLLABLE_ROW_VARIANT_CLASS[props.variant]);
</script>

<template>
	<div
		:class="[
			'ui-scroll-rail-base',
			'overflow-x-auto',
			variantClass,
		]"
	>
		<slot />
	</div>
</template>
