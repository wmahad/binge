<script setup lang="ts">
import { computed } from "vue";
import type { UiElementTag } from "./types";

const BASE_CLASS = "border bg-card";
const SURFACE_VARIANT_CLASS = {
	card: "rounded-xl border-border",
	subtle: "rounded-xl border-border/80",
	pill: "rounded-full border-border",
} as const;

const props = withDefaults(
	defineProps<{
		variant?: "card" | "subtle" | "pill";
		as?: UiElementTag;
	}>(),
	{ variant: "card", as: "div" },
);

const surfaceClass = computed(
	() => `${BASE_CLASS} ${SURFACE_VARIANT_CLASS[props.variant]}`,
);
</script>

<template>
	<component
		:is="as"
		:class="surfaceClass"
	>
		<slot />
	</component>
</template>
