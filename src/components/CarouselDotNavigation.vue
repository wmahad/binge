<script setup lang="ts">
import { computed } from "vue";

const activeIndex = defineModel<number>("activeIndex", { required: true });

const props = withDefaults(
	defineProps<{
		slideCount: number;
		ariaLabel?: string;
		layout?: "hero" | "inline";
	}>(),
	{ ariaLabel: "Slides", layout: "hero" },
);

const rootClass = computed(() =>
	props.layout === "inline"
		? "ui-carousel-dot-nav-inline"
		: "ui-carousel-dot-nav-hero",
);

type DotVm = {
	key: number;
	ariaLabelForDot: string;
	isActive: boolean;
};

const dots = computed((): DotVm[] =>
	Array.from({ length: props.slideCount }, (_, zeroBasedIndex) => {
		const slideNumber = zeroBasedIndex + 1;
		const isActive = zeroBasedIndex === activeIndex.value;
		return {
			key: slideNumber,
			ariaLabelForDot: `Slide ${slideNumber}`,
			isActive,
		};
	}),
);

function selectDot(dot: DotVm) {
	activeIndex.value = dot.key - 1;
}
</script>

<template>
	<div
		v-if="props.slideCount > 0"
		:class="rootClass"
		role="tablist"
		:aria-label="ariaLabel"
	>
		<button
			v-for="dot in dots"
			:key="dot.key"
			type="button"
			role="tab"
			:class="[
				'ui-carousel-dot-button',
				dot.isActive ? 'ui-carousel-dot-active' : 'ui-carousel-dot-inactive',
			]"
			:aria-label="dot.ariaLabelForDot"
			:aria-selected="dot.isActive"
			:aria-current="dot.isActive ? 'true' : undefined"
			@click="selectDot(dot)"
		></button>
	</div>
</template>
