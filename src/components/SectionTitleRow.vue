<script setup lang="ts">
import { AppHeading, AppText } from "./ui";
import type { AppHeadingVariant } from "./ui/types";

export type SectionTitleRowLayout = "standalone" | "withKicker" | "withBlurb";

const SECTION_HEADING_VARIANT: AppHeadingVariant = "section";

const props = defineProps<{
	title: string;
	layout: SectionTitleRowLayout;
	blurb?: string;
}>();
</script>

<template>
	<AppHeading
		v-if="props.layout === 'standalone'"
		:variant="SECTION_HEADING_VARIANT"
		class="mb-6"
	>
		{{ props.title }}
	</AppHeading>
	<div
		v-else-if="props.layout === 'withKicker'"
		class="mb-6 flex items-baseline gap-3"
	>
		<AppHeading :variant="SECTION_HEADING_VARIANT">{{ props.title }}</AppHeading>
		<AppText variant="caption" as="span">
			<slot name="kicker" />
		</AppText>
	</div>
	<template v-else-if="props.layout === 'withBlurb'">
		<AppHeading :variant="SECTION_HEADING_VARIANT" class="mb-1">{{ props.title }}</AppHeading>
		<AppText v-if="props.blurb" variant="muted" class="mb-6">{{ props.blurb }}</AppText>
	</template>
</template>
