<script setup lang="ts">
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { RouterView } from "vue-router";

const isDev = import.meta.env.DEV;
</script>

<template>
	<div class="flex min-h-dvh flex-col bg-zinc-950 text-zinc-100 antialiased">
		<main id="main" class="flex-1">
			<RouterView />
		</main>
		<VueQueryDevtools v-if="isDev" />
	</div>
</template>
