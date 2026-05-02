<script setup lang="ts">
import { computed } from "vue";
import type { AppKickerVariant, UiElementTag } from "./types";

const VARIANT_CLASSES: Record<AppKickerVariant, string> = {
	sectionMeta: "ui-kicker-section-meta",
	eyebrowPrimary: "ui-kicker-eyebrow-primary",
	fieldLabel: "ui-kicker-field-label",
};

const props = withDefaults(
	defineProps<{
		variant: AppKickerVariant;
		as?: UiElementTag;
	}>(),
	{ as: "span" },
);

const variantClass = computed(() => VARIANT_CLASSES[props.variant]);
</script>

<template>
	<component :is="as" :class="variantClass">
		<slot />
	</component>
</template>
