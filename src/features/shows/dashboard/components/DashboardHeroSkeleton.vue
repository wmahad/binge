<script setup lang="ts">
const SKELETON_HERO_TEXT_CLASSES = [
	"ui-skeleton-hero-kicker",
	"ui-skeleton-hero-title",
	"ui-skeleton-hero-summary-wide",
	"ui-skeleton-hero-summary-narrow",
] as const;

const SKELETON_HERO_ACTION_CLASSES = [
	"ui-skeleton-hero-action-primary",
	"ui-skeleton-hero-action-secondary",
] as const;
</script>

<template>
	<section
		class="ui-dashboard-hero-shell overflow-hidden"
		aria-busy="true"
		aria-label="Loading hero"
	>
		<div class="animate-pulse ui-absolute-fill rounded-none bg-card/40!" />
		<div class="ui-overlay-hero-scrim" />
		<div class="ui-hero-content-shell">
			<div class="w-full max-w-2xl space-y-4">
				<div
					v-for="skeletonClass in SKELETON_HERO_TEXT_CLASSES"
					:key="skeletonClass"
					:class="skeletonClass"
				/>
				<div class="flex gap-3 pt-2">
					<div
						v-for="skeletonClass in SKELETON_HERO_ACTION_CLASSES"
						:key="skeletonClass"
						:class="skeletonClass"
					/>
				</div>
			</div>
		</div>
	</section>
</template>
