<script setup lang="ts">
import { AppButton, AppText } from "@src/components";

defineProps<{
	detail: string;
}>();

const emit = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<div
		class="ui-dashboard-error-panel"
		role="alert"
	>
		<AppText variant="destructive">Could not load the TV catalog.</AppText>
		<AppText variant="destructiveMuted">{{ detail }}</AppText>
		<AppButton class="mt-6" @click="emit('retry')">Try again</AppButton>
	</div>
</template>
