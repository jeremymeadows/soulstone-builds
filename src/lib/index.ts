// place files you want to import through the `$lib` alias in this folder.

export const PATCHES = [
    "1.0g"
];

export { Result } from "./utils/result";

export class Build {
    id: string = "";
    name: string;
    created: number;
    owner: string | undefined;
    patch: string = PATCHES[-1];
    character: string | undefined;
    weapon: string | undefined;
    skills: string[] = [];
    runes: string[] = [];
    notes: string = "";
    votes: number = 0;

    constructor(name: string) {
        this.name = name;
        this.created = Math.floor(Date.now() / 1000);
        // this.id = crypto.randomBytes(24).toString('base64');
        // this.id = new Buffer(crypto.getRandomValues(new Uint8Array(24))).toString('base64');
        // this.id = "todo";
    }

    static from(object: any): Build {
        let build = new Build(object.name);
        build.id = object.id;
        build.created = object.created;
        build.owner = object.owner;
        build.patch = object.patch;
        build.character = object.character;
        build.weapon = object.weapon;
        build.skills = object.skills || [];
        build.runes = object.runes || [];
        build.notes = object.notes || "";
        build.votes = object.votes || 0;
        return build;
    }

    pojo(): object {
        return {
            id: this.id,
            name: this.name,
            created: this.created,
            owner: this.owner,
            patch: this.patch,
            character: this.character,
            weapon: this.weapon,
            skills: this.skills,
            runes: this.runes,
            notes: this.notes,
            votes: this.votes
        };
    }
}

export function score(build: Build): number {
    const GRAVITY = 1.5;
    const PATCH_DECAY = 0.5;

    let patch_weight = 1 / ((PATCHES.length - PATCHES.indexOf(build.patch)) * PATCH_DECAY);
    let build_age = Math.floor((build.created - Math.floor(Date.now() / 1000)) / 3600);

    return (build.votes - 1) / ((build_age + 2) ** GRAVITY) * patch_weight;
}

export function img_name(name?: string): string {
    return (name ?? "default").replace(/[^A-Za-z0-9_]/g, "") + ".png";
}

export function sort_by<T>(objects: T[], lambda: (val: any) => number | string): T[] {
    return objects.sort((a: any, b: any) => {
        a = lambda(a);
        b = lambda(b);
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
}

export function sort_by_key<T>(objects: T[], key: string): T[] {
    return objects.sort((a: any, b: any) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    });
}