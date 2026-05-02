<script setup lang="ts">
import { computed } from "vue";
import type { AppTextVariant, UiElementTag } from "./types";

const VARIANT_CLASSES: Record<AppTextVariant, string> = {
	body: "ui-text-body",
	muted: "ui-text-muted",
	mutedResponsive: "ui-text-muted md:text-base",
	mutedXs: "ui-text-muted-xs",
	"muted-inline": "ui-text-muted",
	caption: "ui-text-muted-xs",
	overline: "ui-kicker-eyebrow-primary mb-4 block",
	eyebrow: "ui-text-eyebrow",
	heroLead: "ui-text-hero-lead",
	destructive: "ui-text-destructive",
	destructiveMuted: "ui-text-muted mt-2",
	heroFeatureSummary: "ui-text-muted mb-5 line-clamp-3 max-w-xl md:mb-6 md:text-lg",
};
const INLINE_TEXT_VARIANTS: ReadonlySet<AppTextVariant> = new Set([
	"overline",
	"eyebrow",
	"muted-inline",
	"caption",
]);

const props = defineProps<{
	as?: UiElementTag;
	variant: AppTextVariant;
}>();

const tag = computed(() =>
	props.as ?? (INLINE_TEXT_VARIANTS.has(props.variant) ? "span" : "p"),
);

const variantClass = computed(() => VARIANT_CLASSES[props.variant]);
</script>

<template>
	<component :is="tag" :class="variantClass">
		<slot />
	</component>
</template>
