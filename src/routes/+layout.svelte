<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Tooltips from '$lib/components/Tooltips.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import '/src/global.scss';

	const { children } = $props();

	let height: number = $state(0);
	let headheight = $state(0);
	let footheight = $state(0);
</script>

<svelte:head>
	<title>Soulstone Builds</title>

	<meta name="author" content="Jeremy Meadows" />
	<meta name="description" content="Create, share, and discover builds for Soulstone Survivors." />
	<meta name="url" content="soulstonebuilds.jeremymeadows.dev" />
	<meta name="keywords" content="Soulstone Survivors, Builds" />
</svelte:head>

<svelte:window bind:innerHeight={height} />

<Navbar bind:height={headheight} />

<Tooltips />

<main style:margin-top={headheight + 'px'} style:min-height={height - headheight - footheight + 'px'}>
	{@render children()}
</main>

<Footer bind:height={footheight} />

<style lang="scss">
	main {
		padding-top: 2rem;
		padding-bottom: 6rem;
	}
</style>
