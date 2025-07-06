<script lang="ts">
	import { type Build, score, PATCHES } from '$lib';
	import { load, img_name } from '$lib/assets/images';

	const { data } = $props();
	const { builds, characters, tags } = data;

	let sort = $state('score');

	let filter = $state('_any');
	let search = $state('');
	let tagged = $state([]);
	let current = $state(true);

	let display = $derived(
		builds
			.filter((build: Build) => {
				return (
					(filter === '_any' || build.character === filter) &&
					(current ? build.patch === PATCHES[PATCHES.length - 1] : true) &&
					(tagged.every((tag: string) => build.tags.includes(tag))) &&
					(!search ||
						build.name.toLowerCase().includes(search.toLowerCase()) ||
						build.user_name?.toLowerCase().includes(search.toLowerCase()))
				);
			})
			.sort((a: Build, b: Build) => {
				if (sort === 'score') {
					return score(b) - score(a);
				} else if (sort === 'votes') {
					return (b.votes ?? 0) - (a.votes ?? 0);
				} else if (sort === 'timestamp') {
					return b.timestamp.getTime() - a.timestamp.getTime();
				} else if (sort === 'name') {
					return a.name.localeCompare(b.name);
				}
				return 0;
			})
	);
</script>

{#await load()}
	loading...
{:then images}
	<div class="columns">
		<div class="column">
			<select bind:value={filter}>
				{#each Object.keys(characters) as character}
					<option value={character}>{character === '_any' ? 'All Survivors' : character}</option>
				{/each}
			</select>
		</div>
		<div class="column">
			<input type="text" placeholder="Search builds..." bind:value={search} />
		</div>
		<div class="column">
			<select multiple bind:value={tagged}>
				{#each tags as tag}
					<option value={tag}>{tag}</option>
				{/each}
			</select>
		</div>
		<div class="column">
			<input type="checkbox" checked style="transform: scale(1.5)" />&ensp;Only current patch
		</div>
		<div class="column">
			<select bind:value={sort}>
				<option value="score">Trending</option>
				<option value="votes">Highest Voted</option>
				<option value="timestamp">Newest</option>
				<option value="name">Name</option>
			</select>
		</div>
	</div>

	<div id="featured">
		{#if display.length === 0}
			<p class="center">No builds found.</p>
		{:else}
			{#each display as build}
				<div class="build">
					<a href="/builds/id/{build.id}">
						<h3>{build.name}<span style="color: var(--fg)">{build.user_name}</span></h3>

						<div class="columns">
							<div class="character column is-3">
								<img
									src={images.characters[img_name(build.character)]}
									alt={build.character}
									data-tooltip={build.character}
								/>
								<img src={images.weapons[img_name(build.weapon)]} alt={build.weapon} data-tooltip={build.weapon} />
							</div>

							<div class="skills column center">
								{#each build.skills as skill}
									<img src={images.skills[img_name(skill)]} alt={skill} data-tooltip={skill} />
								{/each}
							</div>

							<div class="runes column is-4">
								<div class="versatility center">
									{#each build.runes.versatility as rune}
											<span class="stack" data-tooltip={rune}>
												<img src={images.runes['RuneBuildFrame']} alt="" class="frame" />
												{#if rune !== '_empty'}
													<img src={images.runes[img_name(rune)]} alt="" class="icon" />
												{/if}
											</span>
									{/each}
								</div>
								<div class="tenacity center">
									{#each build.runes.tenacity as rune}
											<div class="stack" data-tooltip={rune}>
												<img src={images.runes['RuneBuildFrame']} alt="" class="frame" />
												{#if rune !== '_empty'}
													<img src={images.runes[img_name(rune)]} alt="" class="icon" />
												{/if}
											</div>
									{/each}
								</div>
							</div>
						</div>
						<div class="votes columns">
							<span class="column is-2">Votes: {build.votes}</span>
							<span class="column tags">
								{#each build.tags as tag}
									<span class="tag">{tag}</span>
								{/each}
							</span>
							<span class="right column is-2">Patch: {build.patch}</span>
						</div>
					</a>
				</div>
			{/each}
		{/if}
	</div>
{/await}

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

		.stack {
			clip-path: polygon(50% 100%, 100% 62%, 82% 0, 18% 0, 0 62%);
		}

		.icon {
			transform: translateY(-0.4em);
		}
	}

	.runes .tenacity {
		transform: translateY(2.4em);

		.stack {
			clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
		}

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
		margin-top: -0.2rem;
		margin-bottom: 0;

        .tag {
            background-color: var(--primary);
            color: black;
            border-radius: 0.3em;
            font-size: 0.8rem;
        }
    }
</style>
