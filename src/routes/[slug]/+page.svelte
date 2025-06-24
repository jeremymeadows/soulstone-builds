<script lang="ts">
    import { Build, img_name } from "$lib";

	const { data } = $props();

    let build = new Build("test");
    build.character = "Barbarian";
    build.weapon = "Barbaric Cleavers";
    build.skills = [ "Skeletal Mage", "Skeletal Mage", "Skeletal Mage", "Skeletal Mage", "Skeletal Mage", "Skeletal Mage" ]
    build.runes = [ "Weapon Master", "More XP", "Get a skill", "Extra Help", "Skeletal Mage", "Skeletal Mage", "asd" ]
</script>

<h1>Soulstone Builds</h1>
<h2 class="center">Share builds for Soulstone Survivors</h2>

<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<div class="build">
    <h3>{build.name}</h3>

    <span class="character">
        <img src="imgs/characters/{build.character}.png" alt="{build.character}">
        <img src="imgs/weapons/{img_name(build.weapon)}" alt="{build.weapon ?? "any"}">
    </span>

    <span class="skills">
        {#each build.skills as skill}
            <img src="imgs/skills/{img_name(skill)}" alt="{skill}">
        {/each}
    </span>

    <span class="runes">
        {#each build.runes as rune}
            <!-- <div class="r"> -->
            <img src="imgs/runes/RuneBuildFrame.png" alt="" class="frame">
            <!-- <img src="imgs/runes/{img_name(rune)}" alt="{rune}" class="icon"> -->
            <!-- </div> -->
        {/each}
    </span>
</div>

<style lang="scss">
    .build {
        background-color: var(--bg);
        border: 2px solid var(--primary);
        border-radius: 8px;
        height: 156px;
        padding: 6px;
    }

    .build img {
        height: 80px;
    }

    h3 {
        margin-top: 0.2em;
        margin-left: 1em;
        margin-bottom: 0.5em;
    }

    .skills img {
        height: 64px;
        width: 64px;
        margin: 0.2em;
    }

    .runes img:nth-child(odd) {
        transform: translateY(1.0em) scaleY(-1);
    }
    .runes img:nth-child(even) {
        transform: translateY(-3.6em);
        margin: -2.2em;
    }
</style>