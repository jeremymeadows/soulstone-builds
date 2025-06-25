<script lang="ts">
    import { score, sort_by, img_name } from "$lib";

	const { data } = $props();
    const { builds } = data;

    sort_by(builds, score);
</script>

<h1>Soulstone Builds</h1>
<h2 class="center">Share builds for Soulstone Survivors</h2>

<div class="center">
    <a class="button" href="/builds/create">Create Build</a>
</div>

<p>| sort | search | only newest patch | character</p>

<div id="featured">
    {#each builds as build}
        <div class="build">
            <a href="/builds/{build.id}">
                <h3>{build.name}</h3>

                <div class="columns">
                    <div class="character column is-3">
                        <img src="/imgs/characters/{img_name(build.character)}" alt="{build.character}" title="{build.character}">
                        <img src="/imgs/weapons/{img_name(build.weapon)}" alt="{build.weapon}">
                    </div>

                    <div class="skills column center">
                        {#each build.skills as skill, i}
                            <!-- <div class="column"> -->
                                <button><img src="/imgs/skills/{img_name(skill)}" alt="{skill}"></button>
                            <!-- </div> -->
                        {/each}
                    </div>

                    <div class="runes column is-4">
                        <div class="versatility center">
                            {#each build.runes.versatility as rune}
                                <button>
                                    <span class="stack">
                                        <img src="/imgs/runes/RuneBuildFrame.png" alt="" class="frame">
                                        <img src="/imgs/runes/versatility/{img_name(rune)}" alt="" class="icon">
                                    </span>
                                </button>
                            {/each}
                        </div>
                        <div class="tenacity center">
                            {#each build.runes.tenacity as rune}
                                <button>
                                    <div class="stack">
                                        <img src="/imgs/runes/RuneBuildFrame.png" alt="" class="frame">
                                        {#if rune}
                                            <img src="/imgs/runes/tenacity/{img_name(rune)}" alt="" class="icon" hidden={true}>
                                        {/if}
                                    </div>
                                </button>
                            {/each}
                        </div>
                    </div>
                </div>
                <div class="votes columns">
                    <span class="column">Votes: {build.votes}</span>
                    <span class="column"></span>
                    <span class="right column">Patch: {build.patch}</span>
                </div>
            </a>
        </div>
    {/each}
</div>

<style lang="scss">
    .build {
        background-color: var(--bg);
        border: 2px solid var(--primary);
        border-radius: 8px;
        padding: 6px;
    }

    h3 {
        margin-bottom: 0;
    }

    img {
        cursor: pointer;
    }

    .character img {
        height: 100px;
    }

    .skills {
        transform: translateY(1em);
    }

    .skills img {
        width: 64px;
    }

    .runes img.frame {
        width: 60px;
        margin: 0.2em;
    }

    .runes img.icon {
        width: 100%;
        height: 100%;
    }

    .runes .versatility {
        margin-bottom: -5em;
        transform: translateY(-0.5em);

        .icon {
            transform: translateY(-0.4em);
        }
    }

    .runes .tenacity {
        transform: translateY(2.4em);

        .frame {
            transform: scaleY(-1);
        }
    }

    .stack {
        position: relative;
        display: inline-block;

        .frame {
            position: relative;
            top: 0;
            left: 0;
        }

        .icon {
            position: absolute;
            top: 0;
            left: 0;
        }
    }
    
    .votes {
        margin-top: -2.5em;
    }

    .right {
        text-align: right;
    }
</style>