<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		variant?: "primary" | "outline" | "ghost" | "bare" | "overlay";
		size?: "pill" | "pill-sm" | "md" | "icon" | "icon-lg";
		type?: "button" | "submit";
	}>(),
	{ variant: "primary", size: "pill", type: "button" },
);

const emit = defineEmits<{
	click: [event: MouseEvent];
}>();

const VARIANT_CLASSES: Record<
	NonNullable<typeof props.variant>,
	string
> = {
	primary: "ui-surface-primary-base",
	outline: "ui-surface-outline-base hover:bg-secondary",
	ghost: "ui-btn-variant-ghost",
	overlay: "ui-btn-variant-overlay",
	bare: "ui-btn-variant-bare",
};

const variantClass = computed(() => VARIANT_CLASSES[props.variant]);

const SIZE_CLASSES: Record<NonNullable<typeof props.size>, string> = {
	pill: "ui-btn-size-pill",
	"pill-sm": "ui-btn-size-pill-sm",
	md: "ui-btn-size-md",
	icon: "ui-btn-size-icon-base ui-btn-size-icon",
	"icon-lg": "ui-btn-size-icon-base ui-btn-size-icon-lg",
};

const sizeClass = computed(() =>
	props.variant === "bare" ? "" : SIZE_CLASSES[props.size],
);

const classes = computed(() => {
	return `ui-btn-base ${sizeClass.value} ${variantClass.value}`;
});
</script>

<template>
	<button
		:type="type"
		:class="[classes, variant === 'primary' ? 'ui-shadow-glow' : '']"
		@click="emit('click', $event)"
	>
		<slot />
	</button>
</template>
