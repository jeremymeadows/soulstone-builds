<script lang="ts">
    import { type Build, score, sort_by, img_name, PATCHES } from "$lib";

	const { data } = $props();
    const { builds, characters } = data;

    let display = $state(builds);
    let sort = $state("score");
    let filter = $state("any");
    let search = $state("");
    let current = $state(true);

    $effect(() => {
        display = builds.filter((build: Build) => {
            if (filter === "any") return true;
            return build.character === filter && 
                    (search === "" || build.name.toLowerCase().includes(search.toLowerCase())) &&
                    (current ? build.patch === PATCHES[-1] : true);
        }).sort((a: any, b: any) => {
            if (sort === "score") {
                return score(b) - score(a);
            } else if (sort === "votes") {
                return b.votes - a.votes;
            } else if (sort === "timestamp") {
                return b.timestamp - a.timestamp;
            } else if (sort === "name") {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });
    });
</script>

<h1>Soulstone Builds<aside style="font-size: 1rem">*still in beta</aside></h1>
<h2 class="center">Share builds for Soulstone Survivors</h2>

<div class="center">
    <a class="button" href="/builds/+">Create Build</a>
</div>

<br />

<div class="columns">
    <div class="column">
        <select bind:value={sort}>
            <option value="score">Trending</option>
            <option value="votes">Highest Voted</option>
            <option value="timestamp">Newest</option>
            <option value="name">Name</option>
        </select>
    </div>
    <div class="column">
        <input type="text" placeholder="Search builds..." bind:value={search} />
    </div>
    <div class="column">
        <input type="checkbox" checked style="transform: scale(1.5)" />&ensp;Only current patch
    </div>
    <div class="column">
        <select bind:value={filter}>
            {#each Object.keys(characters) as character}
                <option value="{character}">{character}</option>
            {/each}
        </select>
    </div>
</div>

<div id="featured">
    {#each display as build}
        <div class="build">
            <a href="/builds/{build.id}">
                <h3>{build.name}<span style="color: var(--fg)">{build.user_name}</span></h3>

                <div class="columns">
                    <div class="character column is-3">
                        <img src="/imgs/characters/{img_name(build.character)}" alt="{build.character}" title="{build.character}">
                        <img src="/imgs/weapons/{img_name(build.weapon)}" alt="{build.weapon}">
                    </div>

                    <div class="skills column center">
                        {#each build.skills as skill}
                            <button><img src="/imgs/skills/{img_name(skill)}" alt="{skill}"></button>
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
            	{#if build.tags && build.tags.length}
                    <div class="tags">
                        {#each build.tags as tag}
                            <span class="tag">{tag}</span>
                        {/each}
                    </div>
                {/if}
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

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;

        .tag {
            background-color: var(--primary);
            color: rgb(0, 0, 0);
            padding: 0.3em 0.6em;
            border-radius: 0.3em;
            font-size: 0.9rem;
        }
    }
</style>