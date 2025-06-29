<script lang="ts">
	import Build from '$lib/components/Build.svelte';

	const { data } = $props();
</script>

<Build data={data} />