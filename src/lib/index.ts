// place files you want to import through the `$lib` alias in this folder.

export const PATCHES = [
    "1.0g"
];

export { Result } from "./utils/result";

export type Build = {
    id: string,
    name: string,
    user_id: string,
    user_name?: string,
    timestamp: Date,
    patch: string,
    character: string,
    weapon: string,
    skills: string[6] | any,
    runes: object | any,
    notes: string,
    votes?: number,
}

export function score(build: Build): number {
    const GRAVITY = 1.5;
    const PATCH_DECAY = 0.5;

    let patch_weight = 1 / ((PATCHES.length - PATCHES.indexOf(build.patch)) * PATCH_DECAY);
    let build_age = Math.floor((build.timestamp.getSeconds() - new Date().getSeconds()) / 3600);

    return (build.votes! - 1) / ((build_age + 2) ** GRAVITY) * patch_weight;
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