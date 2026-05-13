<script setup lang="ts">
import { AppContainer, AppHeading, AppText, PillLink } from "@src/components";
import { Home } from "lucide-vue-next";
</script>

<template>
	<AppContainer variant="page">
		<div class="ui-empty-state">
			<AppHeading variant="emptyStateTitle" :level="1" class="mb-2">
				Page not found
			</AppHeading>
			<AppText variant="muted" class="mb-6">
				This path doesn’t exist. Head home to keep browsing shows.
			</AppText>
			<PillLink to="/" variant="primary">
				<Home class="h-4 w-4" aria-hidden="true" />
				Back to home
			</PillLink>
		</div>
	</AppContainer>
</template>
