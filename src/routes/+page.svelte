<script lang="ts">
    import { Build, score, sort_by, img_name } from "$lib";

    let test_build = new Build("test");
    test_build.character = "Barbarian";
    test_build.weapon = "Barbaric Cleavers";
    test_build.skills = [ "Skeletal Mage", "Skeletal Mage", "Skeletal Mage", "Skeletal Mage", "Skeletal Mage", "Skeletal Mage" ]
    test_build.runes = [ "Weapon Master", "More XP", "Get a skill", "Extra Help", "Skeletal Mage", "Skeletal Mage", "asd" ]
    test_build.id = "asdf";

    let build2 = new Build("test2");
    build2.character = "Paladin";
    build2.weapon = "Dawnbreaker's Mace";
    build2.skills = [ "Skeletal Mage", "Skeletal Mage", "Skeletal Mage", "Skeletal Mage", "Skeletal Mage", "Skeletal Mage" ]
    build2.id = "jjjj";

    let builds = [ test_build, build2 ];
    sort_by(builds, score);
</script>

<h1>Soulstone Builds</h1>
<h2 class="center">Share builds for Soulstone Survivors</h2>

<div class="center">
<a class="button" href="/create">Create Build</a>
</div>

<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<div id="featured">
    {#each builds as build}
        <a href="{build.id}"><div class="build">
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
        </div></a>
    {/each}
</div>

<style lang="scss">
    #featured {
        background-color: #090014;
        border-radius: 8px;
    }

    .build {
        background-color: var(--bg);
        border: 2px solid var(--secondary);
        border-radius: 8px;
        height: 156px;
        padding: 6px;
        margin-bottom: 8px;
    }

    .build:hover {
        border-color: var(--primary);
        cursor: pointer;
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