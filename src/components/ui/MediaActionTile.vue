<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		variant: "primary" | "outline";
		href?: string;
		external?: boolean;
		nativeType?: "button" | "submit";
	}>(),
	{ external: false, nativeType: "button" },
);

const emit = defineEmits<{
	click: [event: MouseEvent];
}>();

const rootClass = computed(() => {
	const base = "ui-media-action-tile-base";
	const variantClass =
		props.variant === "primary"
			? "ui-surface-primary-base ui-shadow-glow"
			: "ui-surface-outline-base hover:bg-secondary";
	return `group ${base} ${variantClass}`;
});

const iconWrapClass = computed(() =>
	props.variant === "primary"
		? "ui-media-action-icon-primary"
		: "ui-media-action-icon-outline",
);

const labelClass = computed(() => {
	const strongModifier = props.variant === "primary" ? "" : " font-semibold";
	return `ui-media-action-label${strongModifier}`;
});
const rootTag = computed(() => (props.href ? "a" : "button"));

const rootAttrs = computed(() => {
	if (props.href) {
		return {
			href: props.href,
			target: props.external ? "_blank" : undefined,
			rel: props.external ? "noopener noreferrer" : undefined,
		};
	}
	return {
		type: props.nativeType,
	};
});

function onRootClick(event: MouseEvent) {
	if (!props.href) {
		emit("click", event);
	}
}
</script>

<template>
	<component
		:is="rootTag"
		v-bind="rootAttrs"
		:class="rootClass"
		@click="onRootClick"
	>
		<span :class="iconWrapClass"><slot name="icon" /></span>
		<span :class="labelClass"><slot /></span>
	</component>
</template>
