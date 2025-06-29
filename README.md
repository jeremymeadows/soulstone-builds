# Soulstone Builds

Simple website to allow creating and sharing your best builds from [Soulstone Survivors](https://soulstonesurvivors.com)!
Browse new builds and try them out in game.

## Building the Project

Requires [Bun](https://bun.sh) to build. Built using [Svelte](https://svelte.dev/) and [Drizzle](https://orm.drizzle.team/).

Login is done via Steam OpenID, and an API key is needed to get profile information. One can be made at <https://steamcommunity.com/dev/apikey>, and pasted into the `.env` file as shown below.

```sh
git clone git@github.com:jeremymeadows/soulstone-builds.git
cd soulstone-builds
touch .env
bun install
bun x drizzle-kit push
bun --bun run dev
```

`.env`
```conf
STEAM_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Contributing

Pull requests are welcome! If you're wanting to contribute, check out what [issues](https://github.com/jeremymeadows/soulstone-builds/issues) have been logged.