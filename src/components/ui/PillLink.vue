<script setup lang="ts">
import { computed } from "vue";
import { type RouteLocationRaw, RouterLink } from "vue-router";

const props = defineProps<{
	to: RouteLocationRaw;
	variant: "primary" | "soft" | "chip";
	selected?: boolean;
}>();

const PILL_VARIANT_CLASS = {
	primary: "ui-pill-base ui-surface-primary-base ui-shadow-glow",
	soft: "ui-pill-base ui-pill-soft",
} as const;

const linkClass = computed(() => {
	if (props.variant !== "chip") {
		return PILL_VARIANT_CLASS[props.variant];
	}

	return `ui-pill-chip-base ${props.selected
		? "ui-pill-chip-selected"
		: "ui-pill-chip-unselected"}`;
});

</script>

<template>
	<RouterLink :to="to" :class="linkClass">
		<slot />
	</RouterLink>
</template>
