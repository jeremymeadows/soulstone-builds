import { writable } from "svelte/store";

export const user = writable<null | object>(null);