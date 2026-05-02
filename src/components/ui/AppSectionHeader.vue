<script setup lang="ts">
import { computed } from "vue";

const SECTION_HEADER_CLASS = {
	row: "ui-section-header-row",
	page: "ui-section-header-page",
} as const;

const props = withDefaults(
	defineProps<{
		variant?: "row" | "page";
	}>(),
	{ variant: "row" },
);

const headerClass = computed(() => SECTION_HEADER_CLASS[props.variant]);
</script>

<template>
	<div :class="headerClass">
		<div class="min-w-0">
			<slot name="title" />
		</div>
		<div v-if="$slots.action" class="shrink-0">
			<slot name="action" />
		</div>
	</div>
</template>
