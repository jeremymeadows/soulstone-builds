<script lang="ts">
	import BuildList from '$lib/components/BuildList.svelte';

	const { data } = $props();
</script>

<h1>
	Soulstone Builds
	<aside style="font-size: 1rem">*still in beta</aside>
</h1>
<h2 class="center">Share builds for Soulstone Survivors</h2>

<div class="center">
	<a class="button" href="/builds/new">Create Build</a>
</div>

<br />

<BuildList {data} />