<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  import '/src/global.scss';

  const { children } = $props();
</script>

<svelte:head>
  <title>Soulstone Builds</title>

  <meta name="author" content="Jeremy Meadows" />
  <meta name="description" content="Create, share, and discover builds for Soulstone Survivors." />
  <meta name="url" content="soulstonebuilds.jeremymeadows.dev" />
  <meta name="keywords" content="Soulstone, Survivors, Builds" />
</svelte:head>

<Navbar />

<main>
  {@render children()}
</main>

<!-- <Footer /> -->

<style lang="scss">
  main {
    padding-top: 6rem;
    padding-bottom: 6rem;
    min-height: calc(100vh - 4rem + 3px);
  }
</style>
