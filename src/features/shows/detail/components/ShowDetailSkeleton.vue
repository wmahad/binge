<script setup lang="ts">
const SKELETON_HERO_CHIP_KEYS = [0, 1, 2] as const;
const SKELETON_HERO_ACTION_KEYS = [0, 1, 2, 3] as const;
const SKELETON_HERO_META_CLASSES = [
	"ui-skeleton-detail-hero-meta-wide",
	"ui-skeleton-detail-hero-meta-narrow",
	"ui-skeleton-detail-hero-meta-mid",
] as const;
const SKELETON_HERO_SUMMARY_CLASSES = [
	"ui-skeleton-detail-hero-summary-full",
	"ui-skeleton-detail-hero-summary-wide",
	"ui-skeleton-detail-hero-summary-mid",
] as const;
</script>

<template>
	<div class="pb-20">
		<section class="relative overflow-hidden">
			<div class="ui-detail-hero-grid">
				<div class="ui-detail-skeleton-hero-content-column">
					<div class="animate-pulse ui-skeleton-block h-3 w-40" />
					<div class="animate-pulse ui-skeleton-block h-14 w-3/4 md:h-20" />
					<div class="flex gap-3">
						<div
							v-for="skeletonClass in SKELETON_HERO_META_CLASSES"
							:key="skeletonClass"
							:class="skeletonClass"
						/>
					</div>
					<div class="flex gap-2">
						<div
							v-for="key in SKELETON_HERO_CHIP_KEYS"
							:key="key"
							class="animate-pulse ui-skeleton-pill h-6 w-16"
						/>
					</div>
					<div class="space-y-2">
						<div
							v-for="skeletonClass in SKELETON_HERO_SUMMARY_CLASSES"
							:key="skeletonClass"
							:class="skeletonClass"
						/>
					</div>
					<div class="ui-detail-hero-actions-grid">
						<div
							v-for="key in SKELETON_HERO_ACTION_KEYS"
							:key="key"
							class="animate-pulse ui-skeleton-surface-xl h-14"
						/>
					</div>
				</div>
				<div class="ui-detail-hero-sidepanel-shell">
					<div class="ui-skeleton-detail-hero-sidepanel" />
				</div>
			</div>
		</section>
	</div>
</template>
