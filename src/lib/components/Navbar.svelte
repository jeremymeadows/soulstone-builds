<script lang="ts">
  import { onMount } from "svelte";
  import { navigating } from "$app/state";

  const title = "Soulstone Builds";
  let pages: object = $state({
    "Sign In": "/signin",
  });

  let authenticated = false;

  function toggle_menu() {
    const menu = document.getElementById("burger-menu")!;
    menu.classList.toggle("is-active");
    document
      .getElementById(menu.getAttribute("data-target")!)!
      .classList.toggle("is-active");
  }

  onMount(async () => {
    document
      .querySelector(`.navbar-item[href="${document.location.pathname}"]`)
      ?.classList.add("is-current-page");

    authenticated = localStorage.getItem("profile") !== null;
    if (authenticated) {
      pages = {
        "Create Build": "/builds/+",
        "My Builds": "/builds",
        "Sign Out": "/signout",
      }
    }
  });

  $effect(() => {
    if (navigating) {
      toggle_menu();
      document
        .querySelector(".is-current-page")
        ?.classList.remove("is-current-page");
      document
        .querySelector(`.navbar-item[href="${navigating.to?.url.pathname}"]`)
        ?.classList.add("is-current-page");
    }
  });
</script>

<nav
  class="navbar is-fixed-top has-shadow"
  aria-label="main navigation"
>
  <div class="navbar-brand">
    <a href="/" class="navbar-item">{title}</a>
    {#if !true}
      <div class="is-current-page" hidden />
    {/if}

    <a
      id="burger-menu"
      role="button"
      class="navbar-burger"
      aria-label="menu"
      aria-expanded="false"
      data-target="navbar-menu"
      tabindex="0"
      onclick={toggle_menu}
      onkeypress={toggle_menu}
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>

  <div id="navbar-menu" class="navbar-menu">
    <div class="navbar-start" />

    <div class="navbar-end">
      {#each Object.entries(pages) as [page, url]}
        <a href={url} class="navbar-item" data-sveltekit-preload-data={url !== '/signout' ? "off" : ""}>{page}</a>
      {/each}
    </div>
  </div>
</nav>

<style lang="scss">
  nav.navbar {
    margin: -8px;
    margin-bottom: 100%;
    padding: 8px 8px 0 8px;
    background-color: var(--bg);
    box-shadow: 0 2px 0 0 var(--bg-alt);
  }
  @media (min-width: 1200px) {
    nav {
      padding-left: calc((100vw - 1200px) / 2);
      padding-right: calc((100vw - 1200px) / 2);
    }
  }

  .navbar-menu {
    background-color: var(--bg);
  }

  .navbar-item {
    color: var(--fg);
    padding: 0.5rem, 0.75rem;
    gap: 0;
  }

  .navbar-item:hover,
  .navbar-item:focus {
    background: none;
    color: var(--secondary);
  }

  .is-current-page {
    color: var(--primary) !important;
  }
</style>
