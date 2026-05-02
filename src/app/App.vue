<script setup lang="ts">
import { AppHeader } from "@src/components";
import { RouterView } from "vue-router";
</script>

<template>
	<div class="flex min-h-dvh flex-col bg-background text-foreground antialiased">
		<AppHeader />
		<main id="main" class="flex-1 min-h-0">
			<RouterView />
		</main>
	</div>
</template>
